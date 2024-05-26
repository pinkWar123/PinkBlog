import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { ObjectIdArrayValidator } from 'src/decorators/objectId-array-validator';

export class CreateSeriesDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(15)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  @MinLength(100)
  description: string;

  @IsArray()
  @Validate(ObjectIdArrayValidator)
  posts: string[];

  @IsString()
  @IsOptional()
  @IsIn(['ongoing', 'completed'])
  status?: string;

  @IsIn(['public', 'private'], {
    message: 'Access must be either public or private',
  })
  access: string;
}
