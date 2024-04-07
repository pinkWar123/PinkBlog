import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from 'src/decorators/public';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserLoginDto, UserRegisterDto } from 'src/users/dto/create-user.dto';
import { ResponseMessage } from 'src/decorators/response.message';
import { User } from 'src/decorators/user';
import { IUser } from 'src/types/user.type';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage(
    'This API returns an access token if the user logs in successfully',
  )
  @ApiBody({
    type: UserLoginDto,
  })
  @Post('login')
  async login(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res);
  }

  @Get('account')
  @ResponseMessage("This api returns user's information by access token")
  async getUserAccount(@User() user: IUser) {
    console.log(user);
    return user;
  }

  @Public()
  @Post('register')
  @ApiBody({ type: UserRegisterDto })
  @ResponseMessage(
    "This api returns user's information after successful registration",
  )
  register(
    @Body() userRegiserDto: UserRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(userRegiserDto, res);
  }

  @Public()
  @ResponseMessage(
    'This API checks whether or not the account has already existed',
  )
  @Get('check-account/:username')
  checkUserAccount(@Param('username') username: string) {
    return this.usersService.hasUsernameExisted(username);
  }
}
