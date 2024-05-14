import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '@modules/shared/base/base.schema';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true })
export class Permission {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  apiPath: string;

  @Prop({
    required: true,
    type: String,
    enum: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
  })
  method: string;

  @Prop({ required: true, type: String })
  module: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop()
  createdBy: string;

  @Prop()
  updatedBy: string;

  @Prop()
  deletedBy: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
