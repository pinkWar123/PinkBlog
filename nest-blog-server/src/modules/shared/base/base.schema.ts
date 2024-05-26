import { User } from '@modules/users/schemas/user.schema';
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class BaseEntity {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => User.name,
    default: null,
    select: '_id email username profileImageUrl',
  })
  createdBy: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => User.name,
    default: null,
    select: '_id email username profileImageUrl',
  })
  updatedBy: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => User.name,
    default: null,
  })
  deletedBy: string;
}
