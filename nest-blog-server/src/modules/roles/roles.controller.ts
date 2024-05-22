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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage } from 'src/decorators/response.message';
import { User } from 'src/decorators/user';
import { IUser } from 'src/types/user.type';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage('This API returns the result of creating a new role')
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Public()
  @Get()
  @ApiQuery({
    name: 'current',
    type: String,
    description: 'Optional',
    required: false,
  })
  @ApiQuery({
    name: 'pageSize',
    type: String,
    description: 'Optional',
    required: false,
  })
  @ResponseMessage('This API returns a list of roles with pagination')
  // @ApiQuery()
  findRolesWithPagination(
    @Query() qs: string,
    @Query('current') current?: number | undefined,
    @Query('pageSize') pageSize?: number | undefined,
  ) {
    return this.rolesService.findRolesWithPagination(current, pageSize, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('This API returns a roles by ID')
  findRoleById(@Param('id') id: string) {
    return this.rolesService.findRoleById(id);
  }

  @Patch(':id')
  @ResponseMessage('This API returns the result of updating a post by ID')
  updateRoleById(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser,
  ) {
    return this.rolesService.updateRoleById(id, updateRoleDto, user);
  }

  @Delete(':id')
  removeRoleById(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.removeRoleById(id, user);
  }
}
