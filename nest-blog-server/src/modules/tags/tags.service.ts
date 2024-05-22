import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { IUser } from 'src/types/user.type';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { UploadService } from '@modules/upload/upload-file.service';
@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private tagModel: SoftDeleteModel<TagDocument>,
    private uploadService: UploadService,
  ) {}

  async create(
    createTagDto: CreateTagDto,
    file: Express.Multer.File,
    user: IUser,
  ) {
    const hadTagExisted = await this.tagModel.findOne({
      value: createTagDto.value,
      isDeleted: false,
    });
    console.log(hadTagExisted);
    if (hadTagExisted) {
      throw new BadRequestException('The tag has already been created');
    }
    const res = await this.tagModel.create({
      value: createTagDto.value,
      createdBy: user._id,
    });
    let uploadImage = undefined;
    if (res) {
      uploadImage = await this.uploadImageOfTag(res._id.toString(), file, user);
    }
    return {
      ...res.toObject(),
      value: res.value,
      _id: res._id,
      image: uploadImage,
    };
  }

  async uploadImageOfTag(id: string, file: Express.Multer.File, user: IUser) {
    const tag = await this.tagModel.findById(id);
    if (!tag) throw new BadRequestException(`Tag with id ${id} does not exist`);
    // If the tag has already had an image, we need to delete it first
    if (tag?.image?.key) {
      await this.uploadService.remove({ key: tag?.image?.key });
    }
    const res = await this.uploadService.upload('tags', file);
    if (res) {
      await this.tagModel.updateOne(
        { _id: id },
        {
          image: res,
          updatedBy: user._id,
        },
      );
    }
    return res;
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, population, projection } = aqp(qs);
    const { sort }: { sort: any } = aqp(qs);

    const totalItems = await this.tagModel.countDocuments({ ...filter });
    const totalPages = Math.ceil(totalItems / pageSize);
    const calculatedSkip = (current - 1) * pageSize;

    // if (filter && filter.value && filter.value.startsWith('/')) {
    //   console.log('filter:', filter.value.slice(1));
    //   // filter.value = new RegExp(filter.value.slice(1)); // Remove leading slash and create a RegExp object
    // }
    delete filter.current;
    delete filter.pageSize;
    console.log(filter);

    const tags = await this.tagModel
      .find({ ...filter })
      .skip(calculatedSkip > 0 ? calculatedSkip : 0)
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
  }

  async findTagById(id: string) {
    return await this.tagModel.findById(id);
  }

  async updateTagById(
    id: string,
    updateTagDto: UpdateTagDto,
    file: Express.Multer.File,
    user: IUser,
  ) {
    const updateData: any = {
      ...updateTagDto,
      updatedBy: user._id.toString(),
    };
    if (file) {
      const newFile = await this.uploadImageOfTag(id, file, user);
      if (newFile) updateData.image = newFile;
    }
    return await this.tagModel.updateOne(
      { _id: id },
      {
        ...updateTagDto,
        updatedBy: user._id.toString(),
      },
    );
  }

  async removeTagById(id: string, user: IUser) {
    await this.tagModel.updateOne(
      { _id: id },
      {
        deletedBy: user._id.toString(),
      },
    );
    return await this.tagModel.softDelete({ _id: id });
  }
}
