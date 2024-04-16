import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUploadDto {
  @IsString()
  @ApiProperty({
    examples: ['users'],
    description: 'This is the folder name to upload',
  })
  readonly folderName: string;
}
