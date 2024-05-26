import { IsArray, IsMongoId, IsString } from 'class-validator';

export class RemovePostsFromSeriesDto {
  @IsArray()
  @IsString({ each: true })
  @IsMongoId({ each: true })
  postIds: string[];
}
