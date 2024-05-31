import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';
import { Tag, TagDocument } from '@modules/tags/schemas/tag.schema';
import { User } from '@modules/users/schemas/user.schema';
import { BaseEntity } from '@modules/shared/base/base.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post extends BaseEntity {
  @Prop({ required: true, minlength: 100 })
  content: string;

  @Prop({ required: true, minlength: 10, maxlength: 200 })
  title: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Tag.name }] })
  tags: Tag[];

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  upvotedBy: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  devotedBy: string[];

  @Prop({
    type: String,
    enum: ['public', 'private'],
    required: true,
    default: 'public', // Optional: Set a default value
  })
  access: string;

  @Prop({
    type: String,
    enum: ['PENDING', 'REJECTED', 'APPROVED'],
    required: true,
    default: 'PENDING',
    validate: {
      validator: function (value) {
        return (
          value === 'PENDING' || value === 'REJECTED' || value === 'APPROVED'
        );
      },
      message: 'Status must be  either "PENDING" or "REJECTED" or "APPROVED"',
    },
  })
  status: string;

  @Prop({
    type: Number,
    default: 0,
  })
  viewCount: number;

  @Prop({ default: null, type: Date })
  createdAt: Date;

  @Prop({ default: null, type: Date })
  updatedAt: Date;

  @Prop({ default: null, type: Date })
  deletedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
