import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MaxLength(10, { message: 'Name must contain at most 10 characters' })
  @IsNotEmpty()
  @ApiProperty({
    example: 'USER',
    description: 'This is the name of a role',
  })
  name: string;

  @IsString()
  @MaxLength(100, { message: 'Name must contain at most 100 characters' })
  @IsOptional()
  @ApiProperty({
    description: 'This is the optional description of the role',
  })
  description?: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @IsMongoId({ each: true, message: 'Each permission must be a Mongo ID' })
  @IsArray()
  permissions: string[];
}
