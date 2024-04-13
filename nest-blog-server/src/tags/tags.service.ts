import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { IUser } from 'src/types/user.type';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private tagModel: SoftDeleteModel<TagDocument>,
  ) {}

  async create(createTagDto: CreateTagDto, user: IUser) {
    try {
      const hadTagExisted = await this.tagModel.findOne({
        value: createTagDto.value,
      });
      console.log(hadTagExisted);
      if (hadTagExisted) {
        throw new BadRequestException('The tag has already been created');
      }
      const res = await this.tagModel.create({
        value: createTagDto.value,
        createdBy: user._id,
      });
      return {
        value: res.value,
        _id: res._id,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(pageSize: number, qs: string) {
    // try {
    //   const res = await this.tagModel.find().limit(result);
    //   if (res && res.length > 0) {
    //     const tags = res.map((tag) => ({
    //       value: tag.value,
    //       _id: tag._id,
    //     }));
    //     return tags;
    //   }
    //   return [];
    // } catch (error) {
    //   throw new BadRequestException(error.message);
    // }
    try {
      const { filter, population, projection } = aqp(qs);
      const { sort }: { sort: any } = aqp(qs);
      const totalItems = await this.tagModel.count(filter);
      const totalPages = Math.ceil(totalItems / pageSize);
      // const calculatedSkip = (current - 1) * pageSize;
      if (
        filter &&
        filter.value &&
        typeof filter.value === 'string' &&
        filter.value.startsWith('/')
      ) {
        filter.value = new RegExp(filter.value.slice(1)); // Remove leading slash and create a RegExp object
      }
      delete filter.pageSize;
      console.log(filter);
      console.log(sort);

      const tags = await this.tagModel
        .find(filter)
        // .skip(calculatedSkip > 0 ? calculatedSkip : 0)
        .limit(pageSize)
        .sort(sort)
        .select(projection)
        .populate(population)
        .exec();
      return {
        meta: {
          pageSize,
          pages: totalPages,
          total: totalItems,
        },
        result: tags,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
