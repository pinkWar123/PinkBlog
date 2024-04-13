import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';
import { Tag, TagDocument } from 'src/tags/schemas/tag.schema';
import { User } from 'src/users/schemas/user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop()
  content: string;

  @Prop()
  title: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Tag.name })
  tags: mongoose.Schema.Types.ObjectId[];

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

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop({ type: mongoose.Types.ObjectId, ref: User.name })
  createdBy: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: User.name })
  updatedBy: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: User.name })
  deletedBy: mongoose.Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
