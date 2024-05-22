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
  UploadedFile,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { User } from 'src/decorators/user';
import { IUser } from 'src/types/user.type';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorators/response.message';
import { Public } from 'src/decorators/public';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateMongoId } from 'src/pipes/validate-mongoid';
import { SkipCheckPermission } from 'src/decorators/skip-permission';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('This API returns the result of creating a new tag')
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createTagDto: CreateTagDto,
    @User() user: IUser,
  ) {
    return this.tagsService.create(createTagDto, file, user);
  }

  @Post('/:id/image')
  @SkipCheckPermission()
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage(
    'This API returns the result of uploading an image of a tag by id',
  )
  uploadImageOfTag(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ValidateMongoId) id: string,
    @User() user: IUser,
  ) {
    return this.tagsService.uploadImageOfTag(id, file, user);
  }

  @Public()
  @Get()
  @ResponseMessage('This API returns a list of tags')
  findAll(
    @Query('current', ParseIntPipe) current: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query() qs: string,
  ) {
    return this.tagsService.findAll(current, pageSize, qs);
  }

  @Public()
  @ResponseMessage('This API returns a tag by id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findTagById(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('This API returns a tag by id')
  updateTagById(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateTagDto: UpdateTagDto,
    @User() user: IUser,
  ) {
    return this.tagsService.updateTagById(id, updateTagDto, file, user);
  }

  @Delete(':id')
  @ResponseMessage('This API returns the result of deleting a tag by id')
  removeTagById(@Param('id') id: string, @User() user: IUser) {
    return this.tagsService.removeTagById(id, user);
  }
}
