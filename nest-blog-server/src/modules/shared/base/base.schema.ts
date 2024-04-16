import { User } from '@modules/users/schemas/user.schema';
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class BaseEntity {
  @Prop({ default: null })
  createdAt: Date;

  @Prop({ default: null })
  updatedAt: Date;

  @Prop({ default: null })
  deletedAt: Date;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: User.name,
    default: null,
    select: '_id username',
  })
  createdBy: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: User.name,
    default: null,
    select: '_id username',
  })
  updatedBy: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: User.name,
    default: null,
    select: '_id username',
  })
  deletedBy: mongoose.Types.ObjectId;
}
