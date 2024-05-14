import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, UserRegisterDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(UserRegisterDto) {}
