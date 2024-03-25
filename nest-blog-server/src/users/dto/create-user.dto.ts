import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'alice@gmail.com',
    description: "Enter user's email",
  })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456', description: "Enter user's password" })
  readonly password: string;
}
