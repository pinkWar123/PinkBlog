import {
  Permission,
  PermissionDocument,
} from '@modules/permissions/schemas/permission.schema';
import { Role, RoleDocument } from '@modules/roles/schemas/role.schema';
import { User, UserDocument } from '@modules/users/schemas/user.schema';
import { UsersService } from '@modules/users/users.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  INIT_ADMIN_ROLE,
  INIT_PERMISSIONS,
  INIT_USERS,
  INIT_USER_ROLE,
} from './seeding-data';

@Injectable()
export class SeedingService implements OnModuleInit {
  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,

    private configService: ConfigService,

    private usersService: UsersService,
  ) {}

  async onModuleInit() {
    const shouldInit = this.configService.getOrThrow<string>('SHOULD_INIT');
    if (!shouldInit || shouldInit.toLowerCase() !== 'true') return;

    const initPassword = this.configService.getOrThrow<string>('INIT_PASSWORD');
    if (!initPassword) return;

    const hashPassword = this.usersService.getHashPassword(initPassword);

    const countUsers = await this.userModel.count({});
    if (countUsers === 0) {
      if (INIT_USERS.length > 0) {
        const ids = await Promise.all(
          INIT_USERS.map(async (user) => {
            await this.userModel.create({ ...user, password: hashPassword });
          }),
        );
      }
    }

    const adminUserId =
      (await this.userModel.findOne({ username: 'ROOT_ADMIN' }))?._id ?? null;

    const countPermissions = await this.permissionModel.count({});
    if (countPermissions === 0) {
      if (INIT_PERMISSIONS.length > 0)
        await Promise.all(
          INIT_PERMISSIONS.map(async (permission) => {
            await Promise.all(
              permission.children.map(async (child) => {
                await this.permissionModel.create({
                  ...child,
                  module: permission.module,
                  createdBy: adminUserId,
                });
              }),
            );
          }),
        );
    }

    const countRoles = await this.roleModel.count({});
    if (countRoles === 0) {
      const permissions = await this.permissionModel.find({});
      console.log('init roles');
      await Promise.all([
        (async () => {
          const adminRole = await this.roleModel.create({
            ...INIT_ADMIN_ROLE,
            createdBy: adminUserId,
            permissions: permissions,
          });
          await this.userModel.updateOne(
            { _id: adminUserId },
            { role: adminRole._id },
          );
        })(),
        (async () => {
          const userRole = await this.roleModel.create({
            ...INIT_USER_ROLE,
            createdBy: adminUserId,
          });
          await this.userModel.updateOne(
            { username: 'FIRST USER' },
            {
              role: userRole._id,
            },
          );
        })(),
      ]);
    }
  }
}
