import { BaseEntity } from '@modules/shared/base/base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/decorators/user';

export type TagDocument = HydratedDocument<Tag>;

@Schema({ timestamps: true })
export class Tag extends BaseEntity {
  @Prop()
  value: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
