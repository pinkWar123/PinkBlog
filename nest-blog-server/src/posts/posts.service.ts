import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IUser } from 'src/types/user.type';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

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

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
