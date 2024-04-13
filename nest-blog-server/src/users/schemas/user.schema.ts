import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  email?: string;

  @Prop()
  password: string;

  @Prop()
  username: string;

  @Prop()
  age: number;

  @Prop()
  profileImageUrl?: string;

  @Prop()
  description?: string;

  @Prop()
  role?: mongoose.Schema.Types.ObjectId;

  @Prop()
  refreshToken?: string;

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

export const UserSchema = SchemaFactory.createForClass(User);
