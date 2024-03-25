import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Mongoose } from 'mongoose';

@Schema()
export class User {
  @Prop()
  email?: string;

  @Prop()
  password: string;

  @Prop()
  username: string;

  @Prop()
  profileImage?: string;

  @Prop()
  description?: string;

  @Prop()
  role?: mongoose.Schema.Types.ObjectId;

  @Prop()
  refreshToken?: string;
}
