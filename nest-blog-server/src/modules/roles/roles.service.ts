import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/types/user.type';
import {
  Permission,
  PermissionDocument,
} from '@modules/permissions/schemas/permission.schema';
import aqp from 'api-query-params';
import { ROLE } from './role-enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async checkDuplicateRoleName(roleName: string) {
    const hasRoleNameExisted = await this.roleModel.findOne({ name: roleName });
    if (hasRoleNameExisted) {
      throw new BadRequestException('This role name already exists');
    }
  }

  async checkValidPermissionIds(permissionIds: string[]) {
    if (permissionIds.length === 0) return;
    const promises = permissionIds.map(async (permissionId) => {
      const hasPermissionExisted = await this.permissionModel.findById(
        permissionId,
      );
      if (!hasPermissionExisted)
        throw new BadRequestException(
          `Permission with id ${permissionId} does not exist`,
        );
    });
    await Promise.all(promises);
  }

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, permissions } = createRoleDto;
    await this.checkDuplicateRoleName(name);
    await this.checkValidPermissionIds(permissions);

    const res = await this.roleModel.create({
      ...createRoleDto,
      createdBy: user._id,
    });
    return res;
  }

  async findRolesWithPagination(
    current: number | undefined,
    pageSize: number | undefined,
    qs: string,
  ) {
    try {
      const { population, projection, filter } = aqp(qs);
      const { sort }: { sort: any } = aqp(qs);
      delete filter.pageSize;
      delete filter.current;
      const totalItems = await this.roleModel.count({ ...filter });
      const totalPages = pageSize ? Math.ceil(totalItems / pageSize) : 1;
      const calculatedSkip = current ? (current - 1) * pageSize : 0;

      const roles = await this.roleModel
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
        result: roles,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findRoleById(id: string) {
    const res = await this.roleModel.findById(id).populate('permissions');
    return res;
  }

  async updateRoleById(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const { name, permissions } = updateRoleDto;
    // await this.checkDuplicateRoleName(name);
    await this.checkValidPermissionIds(permissions);

    const res = await this.roleModel.updateOne(
      { _id: id },
      {
        ...updateRoleDto,
        updatedBy: user._id,
      },
    );
    return res;
  }

  async removeRoleById(id: string, user: IUser) {
    const targetRole = await this.roleModel.findById(id);
    if (targetRole.name === ROLE.ADMIN) {
      throw new BadRequestException('Cannot delete admin role');
    }
    await this.roleModel.updateOne(
      { _id: id },
      {
        deletedBy: user._id,
      },
    );
    const res = await this.roleModel.softDelete({ _id: id });
    return res;
  }
}
