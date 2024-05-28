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
  ParseIntPipe,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRegisterDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';
import { ResponseMessage } from 'src/decorators/response.message';
import { User } from 'src/decorators/user';
import { IUser } from 'src/types/user.type';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('This API returns the new user that has just been created')
  create(
    @Body() userRegisterDto: UserRegisterDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: IUser,
  ) {
    return this.usersService.create(userRegisterDto, file, user);
  }

  @Public()
  @Get()
  @ResponseMessage('This API returns a list of users with pagination')
  findUsersWithPagination(
    @Query('current', ParseIntPipe) current: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query() qs: string,
  ) {
    return this.usersService.findUsersWithPagination(current, pageSize, qs);
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
    @Query('visitorId') visitorId?: string,
  ) {
    return this.usersService.findFollowersOfUserById(
      id,
      +current,
      +pageSize,
      visitorId,
    );
  }

  @Post('/follow/:id')
  @ResponseMessage('This api returns the result of following a user by ID')
  followUserById(
    @Param('id') targetId: string,
    @Body() followDto: { _id: string },
    @User() user: IUser,
  ) {
    return this.usersService.handleFollowUserById(targetId, followDto);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('This API returns the result of updating a user by id')
  updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: IUser,
  ) {
    return this.usersService.updateUserById(id, updateUserDto, file, user);
  }

  @Delete(':id')
  @ResponseMessage('This API returns the result of deleting a user by id')
  removeUserById(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.removeUserById(id, user);
  }
}
