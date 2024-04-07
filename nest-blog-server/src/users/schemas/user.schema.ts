import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
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
}

export const UserSchema = SchemaFactory.createForClass(User);
