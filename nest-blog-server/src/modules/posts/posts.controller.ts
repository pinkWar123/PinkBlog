import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto, VoteDto } from './dto/update-post.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorators/response.message';
import { User } from 'src/decorators/user';
import { IUser } from 'src/types/user.type';
import { Public } from 'src/decorators/public';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ResponseMessage('This API returns the result of creating a new post')
  create(@Body() createPostDto: CreatePostDto, @User() user: IUser) {
    return this.postsService.create(createPostDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('This API returns a list of posts')
  findAll(
    @Query('pageSize') result: string,
    @Query('current') current: number,
    @Query() qs: string,
    @User() user: IUser,
  ) {
    console.log(user);
    return this.postsService.findAll(+result, +current, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('This API returns a post by ID')
  findPostById(@Param('id') id: string) {
    return this.postsService.findPostById(id);
  }

  @Post('upvote')
  @ResponseMessage('This API returns the result of upvoting a post by a user')
  upvote(@User() user: IUser, @Body() voteDto: VoteDto) {
    return this.postsService.upvote(user, voteDto);
  }

  @Post('downvote')
  @ResponseMessage('This API returns the result of devoting a post by a user')
  downvote(@User() user: IUser, @Body() voteDto: VoteDto) {
    return this.postsService.downvote(user, voteDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
