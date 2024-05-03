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

  @Prop({ required: true, minlength: 10, maxlength: 100 })
  title: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Tag.name }] })
  tags: Tag[];

  @Prop({
    type: String,
    enum: ['public', 'private'],
    required: true,
    default: 'public', // Optional: Set a default value
    validate: {
      validator: function (value) {
        return value === 'public' || value === 'private';
      },
      message: 'Access must be either "public" or "private"',
    },
  })
  access: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
