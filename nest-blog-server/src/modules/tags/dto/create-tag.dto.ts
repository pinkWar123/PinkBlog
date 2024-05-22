import { ApiProperty } from '@nestjs/swagger';
import {
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { IsImageFile } from 'src/decorators/custom-validators/is-image';

export class CreateTagDto {
  @IsNotEmpty({ message: 'Value of tag must not be empty' })
  @IsString({ message: 'Value of tag must be a string' })
  @MaxLength(20, {
    message: 'Tag must contain at most 20 characters',
  })
  @ApiProperty({
    example: 'Reactjs',
    description: "Tag's name",
  })
  value: string;

  @IsOptional()
  @IsString({ message: 'Value of tag must be a string' })
  @MaxLength(500, {
    message: 'Description must contain at most 500 characters',
  })
  @ApiProperty({
    description: 'The description of a tag. Can be optional',
  })
  description?: string;

  @IsHexColor()
  @ApiProperty({
    example: 'fffff',
    description: 'This is the color of the tag. By default, it is magenta',
  })
  color?: string;
}
