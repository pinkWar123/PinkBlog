import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from '@modules/shared/base/base.schema';
import { Permission } from 'src/permissions/schemas/permission.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: Boolean })
  isActive: boolean;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Permission.name }],
  })
  permissions: string[];

  @Prop({
    required: true,
    type: String,
    enum: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
  })
  method: string;

  @Prop({ required: true, type: String })
  module: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
