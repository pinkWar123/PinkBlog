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
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { User } from 'src/decorators/user';
import { IUser } from 'src/types/user.type';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorators/response.message';
import { Public } from 'src/decorators/public';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ResponseMessage('This API returns the result of creating a new tag')
  create(@Body() createTagDto: CreateTagDto, @User() user: IUser) {
    return this.tagsService.create(createTagDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('This API returns a list of tags')
  findAll(@Query('pageSize') result: string, @Query() qs: string) {
    return this.tagsService.findAll(+result, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
