import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {}

export class VoteDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: "Post's id needed to be upvoted/downvoted",
  })
  _id: string;
}
