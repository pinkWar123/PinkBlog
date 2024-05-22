import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { IUser } from 'src/types/user.type';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { VoteDto } from '@modules/posts/dto/update-post.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: SoftDeleteModel<CommentDocument>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: IUser) {
    try {
      const { parentId, content, targetId } = createCommentDto;
      const newComment = await this.commentModel.create({
        targetId,
        content,
        parentId,
        createdBy: user._id,
      });
      if (parentId) {
        await this.commentModel.findByIdAndUpdate(parentId, {
          $push: {
            childrenIds: newComment._id,
          },
        });
      }
      return await newComment.populate([
        {
          path: 'childrenIds',
          populate: {
            path: 'createdBy',
            select: '_id username profileImageUrl',
          },
        },
        { path: 'createdBy', select: '_id username profileImageUrl' },
        {
          path: 'parentId',
          populate: [
            {
              path: 'createdBy',
              select: '_id username profileImageUrl',
            },
          ],
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findCommentsRecursively(
    root: (Comment | mongoose.Schema.Types.ObjectId)[],
    currentId: string | mongoose.Types.ObjectId,
  ) {
    try {
      const comment: CommentDocument | null = await this.commentModel.findById(
        currentId,
      );
      if (comment) {
        root.push(comment.toObject() as Comment);
        await Promise.all(
          comment.childrenIds.map(async (child: any) => {
            await this.findCommentsRecursively(root, child.toString());
          }),
        );
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(
    filter: Record<string, any>,
    current: number,
    pageSize: number,
    qs: string,
  ) {
    try {
      const { population, projection } = aqp(qs);
      const { sort }: { sort: any } = aqp(qs);
      const totalItems = await this.commentModel.count({ parentId: null });
      const totalPages = Math.ceil(totalItems / pageSize);
      const calculatedSkip = (current - 1) * pageSize;
      delete filter.pageSize;
      delete filter.current;

      const comments = await this.commentModel
        .find({ ...filter, parentId: null })
        .skip(calculatedSkip > 0 ? calculatedSkip : 0)
        .limit(pageSize)
        .sort(sort ?? { createdAt: -1 })
        .select(projection)
        .populate([
          { path: 'createdBy', select: '_id username profileImageUrl' },
        ])
        .exec();

      const promises = comments.map(async (comment: Comment) => {
        const flattenCommentArray: Comment[] = [];
        await Promise.all(
          comment.childrenIds.map(async (child: any) => {
            await this.findCommentsRecursively(
              flattenCommentArray,
              child.toString(),
            );
          }),
        );

        // comment.childrenIds.splice(0);
        // comment.childrenIds = flattenCommentArray;
        const populatePromises = flattenCommentArray.map((childId) =>
          this.commentModel
            .findById(childId)
            .populate([
              {
                path: 'parentId',
                populate: [
                  {
                    path: 'createdBy',
                    select: '_id username profileImageUrl',
                  },
                ],
              },
              {
                path: 'createdBy',
                select: '_id username profileImageUrl',
              },
            ])
            .exec(),
        );

        // Execute all queries concurrently
        const populatedChildren = await Promise.all(populatePromises);

        // Assign the populated children to comment.childrenIds
        populatedChildren.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          // return dateA.getTime() - dateB.getTime();
        });
        // .reverse();
        comment.childrenIds = populatedChildren.map((child) => {
          return child._id as unknown as Comment;
        });
        // comment.childrenIds.sort(
        //   (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        // );
      });
      await Promise.all(promises);
      return {
        meta: {
          pageSize,
          pages: totalPages,
          total: totalItems,
        },
        result: comments.sort((a, b) => {
          // Convert the date strings to Date objects
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);

          // Subtract the dates to get a value that is either negative, positive, or zero
          return dateB.getTime() - dateA.getTime();
        }),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findListOfCommentsByIds(
    ids: string[] | mongoose.Schema.Types.ObjectId[],
  ) {
    try {
      const comments: Comment[] = [];
      const promises = ids.map(async (id) => {
        const comment = await this.commentModel.findById(id).populate([
          { path: 'createdBy', select: '_id username profileImageUrl' },
          {
            path: 'parentId',
            populate: {
              path: 'createdBy',
            },
            select: '_id username profileImageUrl',
          },
        ]);
        if (comment) comments.push(comment);
      });
      await Promise.all(promises);
      comments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      return comments;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllComments(current: number, pageSize: number, qs: string) {
    const { filter } = aqp(qs);
    return this.findAll(filter, current, pageSize, qs);
  }

  async findCommentsByPostId(
    targetId: string,
    current: number,
    pageSize: number,
    qs: string,
  ) {
    try {
      const { filter } = aqp(qs);
      return await this.findAll({ ...filter, targetId }, current, pageSize, qs);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findCommentById(id: string) {
    try {
      const res = await this.commentModel.findById(id);
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async upvote(user: IUser, voteDto: VoteDto) {
    try {
      const targetPost = await this.commentModel.findById(voteDto._id);
      const hasUserUpvoted = targetPost.upvotedBy.some(
        (item) => item == user._id,
      );
      if (hasUserUpvoted) {
        throw new Error('Each user can only upvote once');
      }
      targetPost.upvotedBy.push(user._id);
      const hasUserDevoted = targetPost.downvotedBy.some(
        (item) => item == user._id,
      );
      targetPost.likes += 1;
      if (hasUserDevoted) {
        targetPost.downvotedBy = targetPost.downvotedBy.filter(
          (item) => item != user._id,
        );
        targetPost.likes += 1;
      }
      await targetPost.save();
      return {
        likes: targetPost.likes,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async downvote(user: IUser, voteDto: VoteDto) {
    try {
      const targetComment = await this.commentModel.findById(voteDto._id);
      const hasUserDevoted = targetComment.downvotedBy.some(
        (item) => item == user._id,
      );
      if (hasUserDevoted) {
        throw new Error('Each user can only devote once');
      }
      targetComment.downvotedBy.push(user._id);
      const hasUserUpvoted = targetComment.upvotedBy.some(
        (item) => item == user._id,
      );
      targetComment.likes -= 1;
      if (hasUserUpvoted) {
        targetComment.upvotedBy = targetComment.upvotedBy.filter(
          (item) => item != user._id,
        );
        targetComment.likes -= 1;
      }
      await targetComment.save();
      return {
        likes: targetComment.likes,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateCommentById(
    id: string,
    updateCommentDto: UpdateCommentDto,
    user: IUser,
  ) {
    try {
      const targetComment = await this.commentModel.findById(id);
      if (!targetComment)
        throw new BadRequestException(`Comment ${id} not found`);

      if (user._id !== targetComment.createdBy.toString()) {
        throw new ForbiddenException(
          'Only the owner of the comment can update the comment',
        );
      }

      const res = await this.commentModel.updateOne(
        { _id: id },
        {
          ...updateCommentDto,
          updatedBy: user._id,
        },
      );
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async removeCommentById(id: string, user: IUser) {
    try {
      await this.commentModel.updateOne(
        { _id: id },
        {
          deletedBy: user._id,
        },
      );
      const res = await this.commentModel.softDelete({ _id: id });
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
