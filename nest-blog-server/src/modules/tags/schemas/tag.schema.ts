import { BaseEntity } from '@modules/shared/base/base.schema';
import { PublicFile } from '@modules/shared/upload/public-file';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

@Schema({ timestamps: true })
export class Tag extends BaseEntity {
  @Prop({ required: true, unique: true, minlength: 1, maxlength: 50 })
  value: string;

  @Prop({ required: false, maxlength: 500 })
  description?: string;

  @Prop({ default: 'FF00FF' })
  color: string;

  @Prop({
    type: PublicFile,
    default: {
      url: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
    },
  })
  @Type(() => PublicFile)
  image?: PublicFile;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
