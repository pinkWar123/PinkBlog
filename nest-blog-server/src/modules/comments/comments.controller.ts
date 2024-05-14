import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import { ResponseMessage } from 'src/decorators/response.message';
import { User } from 'src/decorators/user';
import { IUser } from 'src/types/user.type';
import mongoose from 'mongoose';
import { VoteDto } from '@modules/posts/dto/update-post.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ResponseMessage('This API returns the id of the newly created comment')
  create(@Body() createCommentDto: CreateCommentDto, @User() user: IUser) {
    return this.commentsService.create(createCommentDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('This api returns all comments')
  findAll(
    @Query('current', ParseIntPipe) current: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query() qs: string,
  ) {
    return this.commentsService.findAllComments(current, pageSize, qs);
  }

  @Public()
  @ResponseMessage('This api returns all comments of a post by id')
  @Get('/posts/:targetId')
  findPostsById(
    @Param('targetId') targetId: string,
    @Query('current', ParseIntPipe) current: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query() qs: string,
  ) {
    return this.commentsService.findCommentsByPostId(
      targetId,
      current,
      pageSize,
      qs,
    );
  }

  @Public()
  @Post('/multiple')
  @ResponseMessage(
    'This api returns a list of comments from a list of comment ids',
  )
  findListOfCommentsByIds(
    @Body() ids: string[] | mongoose.Schema.Types.ObjectId[],
  ) {
    return this.commentsService.findListOfCommentsByIds(ids);
  }

  @Post('upvote')
  @ResponseMessage(
    'This API returns the result of upvoting a post by a comment',
  )
  upvote(@User() user: IUser, @Body() voteDto: VoteDto) {
    return this.commentsService.upvote(user, voteDto);
  }

  @Post('downvote')
  @ResponseMessage(
    'This API returns the result of devoting a post by a comment',
  )
  downvote(@User() user: IUser, @Body() voteDto: VoteDto) {
    return this.commentsService.downvote(user, voteDto);
  }

  @Get(':id')
  @ResponseMessage('This API returns a comment by id')
  findCommentById(@Param('id') id: string) {
    return this.commentsService.findCommentById(id);
  }

  @Patch(':id')
  @ResponseMessage('This API returns the result of updating a comment by id')
  updateCommentById(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: IUser,
  ) {
    return this.commentsService.updateCommentById(id, updateCommentDto, user);
  }

  @Delete(':id')
  @ResponseMessage('This API returns the result of deleting a comment by id')
  removeCommentById(@Param('id') id: string, @User() user: IUser) {
    return this.commentsService.removeCommentById(id, user);
  }
}
