import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { ObjectIdArrayValidator } from 'src/decorators/objectId-array-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Value of title must not be empty' })
  @IsString({ message: 'Value of title must be a string' })
  @MaxLength(200, {
    message: 'Title must contain at most 100 characters',
  })
  @MinLength(20, {
    message: 'Tag must contain at least 20 characters',
  })
  @ApiProperty({
    example: 'The mechanism of ReactJS',
    description: "Post's title",
  })
  title: string;

  @IsNotEmpty({ message: 'Value of content must not be empty' })
  @IsString({ message: 'Value of content must be a string' })
  @ApiProperty({
    example: 'The mechanism of ReactJS',
    description: "Post's content",
  })
  content: string;

  @IsArray()
  @ApiProperty({
    example: 'The mechanism of ReactJS',
    description: "Post's content",
  })
  @Validate(ObjectIdArrayValidator)
  tags: string[];

  @IsIn(['public', 'private'], {
    message: 'Access must be either public or private',
  })
  access: string;
}
