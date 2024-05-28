import {
  Permission,
  PermissionSchema,
} from '@modules/permissions/schemas/permission.schema';
import { Role, RoleSchema } from '@modules/roles/schemas/role.schema';
import { User, UserSchema } from '@modules/users/schemas/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedingController } from './seeding.controller';
import { SeedingService } from './seeding.service';
import { UsersService } from '@modules/users/users.service';
import { UploadModule } from '@modules/upload/upload.module';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    UsersModule,
  ],
  controllers: [SeedingController],
  providers: [SeedingService],
})
export class SeedingModule {}
