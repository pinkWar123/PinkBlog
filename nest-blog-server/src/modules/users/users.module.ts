import { Module, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { User, UserSchema, UserSchemaFactory } from './schemas/user.schema';
import { PostSchema } from '@modules/posts/schemas/post.schema';
import { AuthService } from '@modules/auth/auth.service';
import { AuthModule } from '@modules/auth/auth.module';
import { Role, RoleSchema } from '@modules/roles/schemas/role.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: UserSchemaFactory,
        inject: [getModelToken(Post.name)],
        imports: [
          MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
        ],
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
