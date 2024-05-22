import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Permission } from '@modules/permissions/schemas/permission.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true, maxlength: 10 })
  name: string;

  @Prop({ required: false, maxlength: 100 })
  description?: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: () => Permission.name },
    ],
  })
  permissions: string[];

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

export const RoleSchema = SchemaFactory.createForClass(Role);
