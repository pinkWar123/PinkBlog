import { PartialType } from '@nestjs/swagger';
import { CreateSeriesDto } from './create-series.dto';
import { IsArray, IsString } from 'class-validator';

export class UpdateSeriesDto extends PartialType(CreateSeriesDto) {}

export class AddPostsToSeriesDto {
  @IsArray()
  @IsString({ each: true })
  postIds: string[];
}
