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
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { AddPostsToSeriesDto, UpdateSeriesDto } from './dto/update-series.dto';
import { ResponseMessage } from 'src/decorators/response.message';

import { IUser } from 'src/types/user.type';
import { Public } from 'src/decorators/public';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user';
import { RemovePostsFromSeriesDto } from './dto/delete-series.dto';

@ApiTags('Series')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  @ResponseMessage('This API returns the series that has just been created')
  create(@Body() createSeriesDto: CreateSeriesDto, @User() user: IUser) {
    return this.seriesService.create(createSeriesDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage('This API returns a list of series with pagination')
  findAllWithPagination(
    @Query('current', ParseIntPipe) current: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query() qs: string,
  ) {
    return this.seriesService.findAllWithPagination(current, pageSize, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('This API returns a series by id')
  findSeriesById(@Param('id') id: string) {
    return this.seriesService.findSeriesById(id);
  }

  @Patch(':id')
  @ResponseMessage('This API returns the result of updating a series by id')
  updateSeriesById(
    @Param('id') id: string,
    @Body() updateSeriesDto: UpdateSeriesDto,
    @User() user: IUser,
  ) {
    return this.seriesService.updateSeriesById(id, updateSeriesDto, user);
  }

  @Post(':id/add-posts')
  @ResponseMessage(
    'This API returns the result of adding new posts to a series',
  )
  addPostsToSeriesById(
    @Param('id') id: string,
    @Body() addPostsToSeriesDto: AddPostsToSeriesDto,
    @User() user: IUser,
  ) {
    console.log('dto:', addPostsToSeriesDto);
    return this.seriesService.addPostsToSeriesById(
      id,
      addPostsToSeriesDto.postIds,
      user,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seriesService.remove(+id);
  }

  @Post(':id/remove-posts')
  @ResponseMessage(
    'This API returns the result of deleting posts from a series',
  )
  removePostsFromSeriesById(
    @Param('id') id: string,
    @Body() removePostsFromSeriesDto: RemovePostsFromSeriesDto,
    @User() user: IUser,
  ) {
    console.log(removePostsFromSeriesDto);
    return this.seriesService.removePostsFromSeriesById(
      id,
      removePostsFromSeriesDto.postIds,
      user,
    );
  }
}
