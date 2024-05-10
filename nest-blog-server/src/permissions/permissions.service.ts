import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/types/user.type';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async checkDuplicatePermission(apiPath: string, method: string) {
    const hasPermissionExisted = await this.permissionModel.findOne({
      apiPath,
      method,
    });
    if (hasPermissionExisted) {
      throw new BadRequestException(
        'This permission has already been created.',
      );
    }
  }
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { apiPath, method } = createPermissionDto;
    await this.checkDuplicatePermission(apiPath, method);
    const res = await this.permissionModel.create({
      ...createPermissionDto,
      createdBy: user._id,
    });
    return res;
  }

  async findAllPermissionsWithPagination(
    current: number,
    pageSize: number,
    qs: string,
  ) {
    try {
      const { population, projection, filter } = aqp(qs);
      const { sort }: { sort: any } = aqp(qs);
      const totalItems = await this.permissionModel.count({ ...filter });
      const totalPages = Math.ceil(totalItems / pageSize);
      const calculatedSkip = (current - 1) * pageSize;
      delete filter.pageSize;
      delete filter.current;

      const permissions = await this.permissionModel
        .find({ ...filter })
        .skip(calculatedSkip > 0 ? calculatedSkip : 0)
        .limit(pageSize)
        .sort(sort ?? { createdAt: -1 })
        .select(projection)
        .exec();
      return {
        meta: {
          pageSize,
          pages: totalPages,
          total: totalItems,
        },
        result: permissions,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findPermissionById(id: string) {
    try {
      const permission = await this.permissionModel.findById(id);
      return permission;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser,
  ) {
    try {
      const { apiPath, method } = updatePermissionDto;
      await this.checkDuplicatePermission(apiPath, method);

      const res = await this.permissionModel.updateOne(
        { _id: id },
        { ...updatePermissionDto, updatedBy: user._id },
      );
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async removePermissionById(id: string, user: IUser) {
    try {
      await this.permissionModel.updateOne(
        { _id: id },
        {
          deletedBy: user._id,
        },
      );
      const res = await this.permissionModel.softDelete({ _id: id });
      return res;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
