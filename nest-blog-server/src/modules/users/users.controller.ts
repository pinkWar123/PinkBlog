import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRegisterDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import { ResponseMessage } from 'src/decorators/response.message';

@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() userRegisterDto: UserRegisterDto) {
    return this.usersService.create(userRegisterDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Public()
  @Get(':id')
  @ResponseMessage('This api returns some basic information of a user by id')
  findOne(@Param('id') id: string, @Query('visitorId') visitorId: string) {
    return this.usersService.findOneById(id, visitorId);
  }

  @Public()
  @Get(':id/followers')
  @ResponseMessage('This api returns followers of a user by id')
  findFollowersOfUserById(
    @Param('id') id: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.usersService.findFollowersOfUserById(id, +current, +pageSize);
  }

  @Post('/follow/:id')
  @ResponseMessage('This api returns the result of following a user by ID')
  followUserById(
    @Param('id') targetId: string,
    @Body() followDto: { _id: string },
  ) {
    return this.usersService.handleFollowUserById(targetId, followDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
