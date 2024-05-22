import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { MODULES_ENUM, Method } from '../method.enum';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  apiPath: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(Method)
  method: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(MODULES_ENUM)
  module: string;
}
