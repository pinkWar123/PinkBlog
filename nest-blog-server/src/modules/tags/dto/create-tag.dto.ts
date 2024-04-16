import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
}
