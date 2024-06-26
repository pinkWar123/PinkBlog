import { PostDocument } from '@modules/posts/schemas/post.schema';
import { Role } from '@modules/roles/schemas/role.schema';
import { BaseEntity } from '@modules/shared/base/base.schema';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { NextFunction } from 'express';
import mongoose, { HydratedDocument, Model, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
@UseInterceptors(ClassSerializerInterceptor)
export class User {
  _id: string;

  @Prop({
    required: false,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  })
  email?: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ required: true, minlength: 6, maxlength: 20, unique: true })
  username: string;

  @Prop({ required: true })
  age: number;

  @Prop({
    default:
      'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
  })
  profileImageUrl?: string;

  @Prop()
  profileImageKey?: string;

  @Prop({ maxlength: 500 })
  description?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
  role: string;

  @Prop()
  refreshToken?: string;

  @Prop({ default: 0 })
  reputation: number;

  @Prop({ default: 0 })
  numOfPosts: number;

  @Prop({
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: User.name,
        default: null,
        select: '_id username profileImageUrl',
      },
    ],
  })
  followedBy: string[];

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        default: null,
      },
    ],
  })
  following: User[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    default: null,
    select: '_id username',
  })
  createdBy: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    default: null,
    select: '_id username',
  })
  updatedBy: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    default: null,
    select: '_id username',
  })
  deletedBy: User;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserSchemaFactory = (postModel: Model<PostDocument>) => {
  const user_schema = UserSchema;

  user_schema.pre('findOneAndDelete', async function (next: NextFunction) {
    // OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
    const user = await this.model.findOne(this.getFilter());
    await Promise.all([
      postModel
        .deleteMany({
          user: user._id,
        })
        .exec(),
    ]);
    return next();
  });
  return user_schema;
};
