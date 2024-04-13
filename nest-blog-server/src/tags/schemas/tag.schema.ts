import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/decorators/user';

export type TagDocument = HydratedDocument<Tag>;

@Schema({ timestamps: true })
export class Tag {
  @Prop()
  value: string;

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

export const TagSchema = SchemaFactory.createForClass(Tag);
