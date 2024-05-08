import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto, VoteDto } from './dto/update-post.dto';
import { IUser } from 'src/types/user.type';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: SoftDeleteModel<PostDocument>,
  ) {}
  async create(createPostDto: CreatePostDto, user: IUser) {
    try {
      const hasTitleExisted = await this.postModel.findOne({
        title: createPostDto.title,
      });
      if (hasTitleExisted) {
        throw new BadRequestException('This title has already existed');
      }
      const res = await this.postModel.create({
        ...createPostDto,
        createdBy: user._id,
      });
      // await res.populate('tags');
      // const tags = res.tags.map(tag: => {
      //   value: tag.value
      // })
      const newPost = await this.postModel
        .findOne({ _id: res._id })
        .populate('tags', {
          value: 1,
          _id: 1,
        })
        .populate('createdBy', {
          username: 1,
          _id: 1,
        });
      return {
        title: res.title,
        content: res.content,
        tags: newPost.tags,
        author: newPost.createdBy,
        createdAt: newPost.createdAt,
        updatedAt: newPost.updatedAt,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(pageSize: number, current: number, qs: string) {
    try {
      const { filter, population, projection } = aqp(qs);
      delete filter.pageSize;
      delete filter.current;
      const { sort }: { sort: any } = aqp(qs);
      const totalItems = await this.postModel.count({
        ...filter,
        access: 'public',
      });
      console.log(filter);
      const totalPages = Math.ceil(totalItems / pageSize);
      const calculatedSkip = (current - 1) * pageSize;

      const posts = await this.postModel
        .find({ ...filter, access: 'public' })
        .skip(calculatedSkip > 0 ? calculatedSkip : 0)
        .limit(pageSize)
        .sort(sort)
        .select({
          createdAt: 1,
          createdBy: 1,
          tags: 1,
          title: 1,
          updatedAt: 1,
          _id: 1,
        })
        .populate('createdBy', '_id username profileImageUrl')
        .populate('tags', 'value _id')
        .exec();
      return {
        meta: {
          pageSize,
          pages: totalPages,
          total: totalItems,
        },
        result: posts,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findPostById(id: string) {
    try {
      const res = await this.postModel.findById(id);
      if (res) {
        const post = (await res.populate('tags', '_id value')).populate(
          'createdBy',
          '_id username profileImageUrl',
        );
        return post;
      }
      return null;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async upvote(user: IUser, voteDto: VoteDto) {
    try {
      const targetPost = await this.postModel.findById(voteDto._id);
      const hasUserUpvoted = targetPost.upvotedBy.some(
        (item) => item == user._id,
      );
      if (hasUserUpvoted) {
        throw new Error('Each user can only upvote once');
      }
      targetPost.upvotedBy.push(user._id);
      const hasUserDevoted = targetPost.devotedBy.some(
        (item) => item == user._id,
      );
      targetPost.likes += 1;
      if (hasUserDevoted) {
        targetPost.devotedBy = targetPost.devotedBy.filter(
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
      const targetPost = await this.postModel.findById(voteDto._id);
      const hasUserDevoted = targetPost.devotedBy.some(
        (item) => item == user._id,
      );
      if (hasUserDevoted) {
        throw new Error('Each user can only devote once');
      }
      targetPost.devotedBy.push(user._id);
      const hasUserUpvoted = targetPost.upvotedBy.some(
        (item) => item == user._id,
      );
      targetPost.likes -= 1;
      if (hasUserUpvoted) {
        targetPost.upvotedBy = targetPost.upvotedBy.filter(
          (item) => item != user._id,
        );
        targetPost.likes -= 1;
      }
      await targetPost.save();
      return {
        likes: targetPost.likes,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
