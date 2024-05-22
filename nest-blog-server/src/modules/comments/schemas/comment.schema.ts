import { Post } from '@modules/posts/schemas/post.schema';
import { BaseEntity } from '@modules/shared/base/base.schema';
import { User } from '@modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment extends BaseEntity {
  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
    ref: Post.name,
  })
  targetId: mongoose.Types.ObjectId | Post;

  @Prop({ require: true, maxlength: 1000 })
  content: string;

  @Prop({ default: 0 })
  totalLike: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Comment.name,
    default: null,
  })
  parentId: Comment;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Comment.name }],
  })
  childrenIds: Comment[] | mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
  })
  upvotedBy: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
  })
  downvotedBy: string[];

  @Prop({ default: 0 })
  likes: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.plugin(autopopulate);
