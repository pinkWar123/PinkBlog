import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage } from 'src/decorators/response.message';
import { User } from 'src/decorators/user';
import { IUser } from 'src/types/user.type';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage('This API returns the result of creating a new permission')
  create(
    @Body() createPermissionDto: CreatePermissionDto,
    @User() user: IUser,
  ) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @ResponseMessage('This API returns a list of permissions with pagination')
  findAllPermissionsWithPagination(
    @Query('current', ParseIntPipe) current: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query() qs: string,
  ) {
    return this.permissionsService.findAllPermissionsWithPagination(
      current,
      pageSize,
      qs,
    );
  }

  @Get(':id')
  @ResponseMessage('This API returns a permission by ID')
  findPermissionById(@Param('id') id: string) {
    return this.permissionsService.findPermissionById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @User() user: IUser,
  ) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @ResponseMessage('This API returns the result of deleting a permission by ID')
  removePermissionById(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.removePermissionById(id, user);
  }
}
