import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Method } from '../method.enum';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
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
  module: string;
}
