import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Permission } from '@modules/permissions/schemas/permission.schema';
import { BaseEntity } from '@modules/shared/base/base.schema';
import { Post } from '@modules/posts/schemas/post.schema';
import { PublicFile } from 'src/types/public-file.type';
import { Tag } from '@modules/tags/schemas/tag.schema';
import { Comment } from '@modules/comments/schemas/comment.schema';

export type SeriesDocument = HydratedDocument<Series>;

@Schema({ timestamps: true })
export class Series extends BaseEntity {
  @Prop({ required: true, unique: true, minlength: 15, maxlength: 100 })
  title: string;

  @Prop({ required: true, minlength: 100, maxlength: 1000 })
  description: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Tag.name }] })
  tags: Tag[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Post.name }] })
  posts: Post[];

  @Prop({ type: String })
  coverImage: PublicFile;

  @Prop({ type: String, enum: ['ongoing', 'completed'], default: 'ongoing' })
  status: string;

  @Prop({
    type: String,
    enum: ['public', 'private'],
    required: true,
    default: 'public', // Optional: Set a default value
  })
  access: string;

  @Prop({ type: Number, default: 0 })
  viewCount: number;

  @Prop({ type: Number, default: 0 })
  likes: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Comment.name }] })
  comments: string[];

  @Prop({ type: Number, min: 0, max: 5, default: 0 })
  rating: number;
}

export const SeriesSchema = SchemaFactory.createForClass(Series);
