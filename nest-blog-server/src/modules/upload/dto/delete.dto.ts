import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DeleteDto {
  @IsString()
  @ApiProperty({
    description: 'This is the file name to upload',
  })
  readonly key: string;
}
