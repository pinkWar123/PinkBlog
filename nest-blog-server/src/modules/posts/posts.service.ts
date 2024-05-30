import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto, VoteDto } from './dto/update-post.dto';
import { IUser } from 'src/types/user.type';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { Series, SeriesDocument } from 'src/series/schemas/series.schema';
import mongoose from 'mongoose';
import { User, UserDocument } from '@modules/users/schemas/user.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-redis-yet';
import { RedisCache } from 'cache-manager-redis-yet';
import { RedisService } from '@modules/redis/redis.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: SoftDeleteModel<PostDocument>,
    @InjectModel(Series.name)
    private seriesModel: SoftDeleteModel<SeriesDocument>,
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    private redisService: RedisService,
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
        status: createPostDto.status ? createPostDto.status : 'PENDING',
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
    const { filter, population, projection } = aqp(qs);
    delete filter.pageSize;
    delete filter.current;
    const { sort }: { sort: any } = aqp(qs);
    const totalItems = await this.postModel.count({
      ...filter,
    });
    const totalPages = Math.ceil(totalItems / pageSize);
    const calculatedSkip = (current - 1) * pageSize;

    const posts = await this.postModel
      .find({ ...filter })
      .skip(calculatedSkip > 0 ? calculatedSkip : 0)
      .limit(pageSize)
      .sort(sort)
      .select(projection)
      .populate([
        {
          path: 'createdBy',
          select: '_id username profileImageUrl',
        },
      ])
      .populate('tags')
      .exec();
    return {
      meta: {
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result: posts,
    };
  }

  async findPostById(id: string) {
    try {
      const res = await this.postModel.findById(id);
      if (res) {
        const post1 = await this.redisService.get(`posts:${id}:viewcount`);
        console.log('Output1', post1);
        const post2 = await this.redisService.get(`posts:${id}`);
        console.log('Output2', post2);
        const post = (await res.populate('tags', '_id value')).populate(
          'createdBy',
          '_id username profileImageUrl email',
        );
        await this.redisService.incr(`posts:${id}:viewcount`);
        return post;
      }
      return null;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updatePostById(id: string, updatePostDto: UpdatePostDto, user: IUser) {
    if (!id || !updatePostDto) throw new BadRequestException();
    const postToUpdate = await this.postModel.findById(id);
    const createdBy =
      postToUpdate?.createdBy as unknown as mongoose.Types.ObjectId;
    if (!createdBy.equals(user._id) && user?.role?.name !== 'ADMIN')
      throw new ForbiddenException('Only author or admin can modify a post');
    const res = await this.postModel.updateOne(
      { _id: id },
      { ...updatePostDto, updatedBy: user._id },
    );

    const tags = updatePostDto?.tags;
    if (tags?.length > 0) {
      await this.updateTagsOnPostChange(id, user);
    }

    return res;
  }

  async updateTagsOnPostChange(postId: string, user: IUser) {
    const seriesToUpdate = await this.seriesModel
      .find({
        posts: new mongoose.Types.ObjectId(postId),
      })
      .populate('posts');
    if (seriesToUpdate?.length > 0) {
      const promises = seriesToUpdate.map(async (series) => {
        const _series = series as unknown as { _id: mongoose.Types.ObjectId };
        const posts = series.posts;
        const tagSet = new Set<string>();
        posts?.forEach((post) => {
          const tags = post.tags;
          tags?.forEach((tag) => {
            const _tag = tag as unknown as { _id: mongoose.Types.ObjectId };
            tagSet.add(_tag?._id?.toString());
          });
        });
        await this.seriesModel.updateOne(
          { _id: _series._id.toString() },
          {
            tags: Array.from(tagSet),
            updateBy: user._id,
          },
        );
      });
      await Promise.all(promises);
    }
  }

  async findFollowingPosts(current: number, pageSize: number, user: IUser) {
    const _user = await this.userModel.findById(user._id);
    if (_user?.following?.length === 0) {
      return {
        meta: {
          pageSize,
          pages: 0,
          total: 0,
        },
        result: [],
      };
    }
    const followingIds = _user?.following?.map((item) => {
      const _item = item as unknown as { _id: mongoose.Types.ObjectId };
      return _item._id.toString();
    });
    let queryString = 'createdBy=';
    followingIds?.forEach((id) => (queryString += `${id},`));
    queryString = queryString.slice(0, -1);
    return await this.findAll(pageSize, current, queryString);
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

  async removePostById(id: string, user: IUser) {
    const postToRemove = await this.postModel.findById(id);
    if (
      postToRemove.createdBy.toString() !== user._id ||
      user?.role?.name !== 'ADMIN'
    ) {
      throw new ForbiddenException('Only admin or author can delete this post');
    }

    await Promise.all([
      async () => {
        await this.postModel.updateOne(
          { _id: id },
          {
            deletedBy: user._id,
          },
        );
      },
      async () => {
        if (postToRemove?._id)
          await this.userModel.updateOne(
            { _id: postToRemove._id.toString() },
            {
              $inc: { numOfPosts: -1 },
            },
          );
      },
    ]);
    const res = await this.postModel.softDelete({ _id: id });
    const seriesToUpdate = await this.seriesModel
      .find({
        posts: new mongoose.Types.ObjectId(id),
      })
      .populate('posts');
    if (seriesToUpdate?.length > 0) {
      const promises = seriesToUpdate.map(async (series) => {
        const _series = series as unknown as { _id: mongoose.Types.ObjectId };
        const posts = series?.posts?.filter((post) => {
          const _post = post as unknown as { _id: mongoose.Types.ObjectId };
          return !_post._id.equals(id);
        });
        const tagSet = new Set<string>();
        posts?.forEach((post) => {
          const tags = post.tags;
          tags?.forEach((tag) => {
            const _tag = tag as unknown as { _id: mongoose.Types.ObjectId };
            tagSet.add(_tag?._id?.toString());
          });
        });
        await this.seriesModel.updateOne(
          { _id: _series._id.toString() },
          {
            tags: Array.from(tagSet),
            updateBy: user._id,
          },
        );
      });
      await Promise.all(promises);
    }
    return res;
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async updateViewCount() {
    const keys = await this.redisService.keys('posts:*:viewcount');
    // console.log(keys);

    await Promise.all(
      keys?.map(async (key) => {
        const id = key.split(':')[1];
        const views = parseInt(await this.redisService.get(key), 10);
        if (views > 0) {
          await this.postModel.updateOne(
            { _id: id },
            {
              $inc: {
                viewCount: views,
              },
            },
          );
          await this.seriesModel.updateMany(
            {
              posts: new mongoose.Types.ObjectId(id),
            },
            {
              $inc: {
                viewCount: views,
              },
            },
          );
          await this.redisService.del(key);
        }
      }),
    );
  }
}
