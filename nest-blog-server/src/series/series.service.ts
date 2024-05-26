import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Series, SeriesDocument } from './schemas/series.schema';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/types/user.type';
import { PostsService } from '@modules/posts/posts.service';
import aqp from 'api-query-params';
import { User } from '@modules/users/schemas/user.schema';
import { Post } from '@modules/posts/schemas/post.schema';

@Injectable()
export class SeriesService {
  constructor(
    @InjectModel(Series.name)
    private seriesModel: SoftDeleteModel<SeriesDocument>,
    private postsService: PostsService,
  ) {}

  async create(createSeriesDto: CreateSeriesDto, user: IUser) {
    const posts = createSeriesDto.posts;
    if (posts?.length > 0) {
      const promises = posts.map(async (_post) => {
        const post = (await this.postsService.findPostById(_post)).toObject();
        if (!post)
          throw new BadRequestException(`Post with id ${_post} not found`);
        const author = post.createdBy as unknown as User;
        if (author._id.toString() !== user._id) {
          console.log(author._id.toString());
          console.log(user._id);
          throw new BadRequestException(
            `The post with id ${_post} is not created by user with id ${user._id}`,
          );
        }
      });
      await Promise.all(promises);
    }
    const res = await this.seriesModel.create({
      ...createSeriesDto,
      createdBy: user._id,
    });

    const postPromises = posts?.map(async (post) => {
      return await this.postsService.findPostById(post);
    });

    const targetPosts = await Promise.all(postPromises);

    const tagIds = new Set(targetPosts);

    await this.seriesModel.updateOne(
      { _id: res._id.toString() },
      {
        tags: tagIds,
        updatedBy: user._id,
      },
    );
    return res;
  }

  async findAllWithPagination(current: number, pageSize: number, qs: string) {
    const { filter, population, projection } = aqp(qs);
    const { sort }: { sort: any } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const totalItems = await this.seriesModel.countDocuments({ ...filter });
    const totalPages = Math.ceil(totalItems / pageSize);
    const calculatedSkip = (current - 1) * pageSize;

    const series = await this.seriesModel
      .find({ ...filter })
      .skip(calculatedSkip > 0 ? calculatedSkip : 0)
      .limit(pageSize)
      .sort(sort)
      .select(projection)
      .populate('createdBy', '_id username profileImageUrl')
      .populate('tags')
      .exec();
    return {
      meta: {
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result: series,
    };
  }

  async findSeriesById(id: string) {
    const res = (
      await this.seriesModel.findById(id).populate([
        {
          path: 'posts',
          populate: [
            {
              path: 'createdBy',
              select: '_id username profileImageUrl',
            },
            {
              path: 'tags',
            },
          ],
        },
        {
          path: 'tags',
        },
        {
          path: 'createdBy',
          select: { password: 0, refreshToken: 0 },
        },
      ])
    ).toObject();
    return res;
  }

  async updateSeriesById(
    id: string,
    updateSeriesDto: UpdateSeriesDto,
    user: IUser,
  ) {
    return await this.seriesModel.updateOne(
      { _id: id },
      { ...updateSeriesDto, updatedBy: user._id },
    );
  }

  getTagIdsFromPosts(posts: Post[]) {
    const tagIds = new Set();
    posts?.forEach((post) => {
      post?.tags?.forEach((tag) => {
        const _tag = tag as unknown as { _id: string };
        tagIds.add(_tag._id.toString());
      });
    });
    return Array.from(tagIds);
  }

  async addPostsToSeriesById(id: string, postIds: string[], user: IUser) {
    const series = await this.seriesModel.findById(id);
    if (!series)
      throw new BadRequestException(`Series with id ${id} not found`);
    if (series.createdBy.toString() !== user._id)
      throw new ForbiddenException(
        `You are not allowed to update a series that is not your own`,
      );
    const promises =
      postIds?.map(async (postId) => {
        return await this.postsService.findPostById(postId);
      }) ?? [];

    let addedPromises = [];
    if (promises.length > 0) addedPromises = await Promise.all(promises);

    const currentTags = new Set(
      series?.tags?.map((tag) => {
        const _tag = tag as unknown as { _id: string };
        return _tag._id.toString();
      }),
    );
    addedPromises?.forEach((addedPost: Post) => {
      const author = addedPost.createdBy as unknown as {
        _id: mongoose.Types.ObjectId;
      };
      if (!author._id.equals(user._id))
        throw new ForbiddenException(
          'You are not allowed to add posts that are not your own',
        );
      addedPost?.tags?.forEach((tag) => {
        const _tag = tag as unknown as { _id: string };
        currentTags.add(_tag._id.toString());
      });
    });

    const res = await this.seriesModel.updateOne(
      { _id: id },
      {
        $push: { posts: { $each: postIds } },
        $set: { updatedBy: user._id, tags: Array.from(currentTags) },
      },
    );

    return res;
  }

  remove(id: number) {
    return `This action removes a #${id} series`;
  }

  async removePostsFromSeriesById(id: string, postIds: string[], user: IUser) {
    if (!postIds)
      throw new BadRequestException('Missing ids of posts to remove');
    const series = await this.seriesModel.findById(id).populate('posts');
    const posts = series.posts;
    console.log(posts);
    const newPosts = posts?.filter((item) => {
      const _item = item as unknown as { _id: string };
      return !postIds.includes(_item._id.toString());
    });

    const tagIds = this.getTagIdsFromPosts(newPosts);

    const res = await this.seriesModel.updateOne(
      { _id: id },
      {
        $set: {
          updatedBy: user._id,
          tags: tagIds,
          posts: newPosts,
        },
      },
    );

    return res;
  }
}
