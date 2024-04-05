import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'alice@gmail.com',
    description: "Enter user's usename",
  })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456', description: "Enter user's password" })
  readonly password: string;
}

export class UserRegisterDto {
  @IsString({ message: 'Username must be a string' })
  @MinLength(6, { message: 'Username must contain at least 6 characters' })
  @MaxLength(20, {
    message: 'Username must contain at most 20 characters',
  })
  @IsNotEmpty({ message: 'Username must not be empty' })
  @ApiProperty({
    example: 'john123',
    description: "Enter user's username",
  })
  username: string;

  @IsString({ message: 'Username must be a string' })
  @MinLength(6, { message: 'Username must contain at least 6 characters' })
  @MaxLength(20, {
    message: 'Username must contain at most 20 characters',
  })
  @IsNotEmpty({ message: 'Password must not be empty' })
  @ApiProperty({
    example: '123456',
    description: "Enter user's password",
  })
  password: string;

  @IsEmail(
    {},
    {
      message: 'Your email is not valid',
    },
  )
  @IsOptional()
  @ApiProperty({
    example: 'john@gmail.com',
    description: "Enter user's email so that we can send you notification",
  })
  email?: string;

  @IsString({ message: 'Description must be a string' })
  @MaxLength(100, {
    message: 'Description must contain at most 100 characters',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 18,
    description: "Enter user's age",
  })
  @IsNumber({}, { message: 'Age must be a number' })
  @Min(1, { message: 'Please enter a positive number' })
  age: number;

  @IsString({ message: 'Profile image url must be a string' })
  @IsOptional()
  @ApiProperty({
    description:
      "This is the profile image url. User's profile image can be retrieved in profile folder",
  })
  profileImageUrl?: string;
}
