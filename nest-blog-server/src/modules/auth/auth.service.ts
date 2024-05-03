import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { IUser } from 'src/types/user.type';
import { UserRegisterDto } from '@modules/users/dto/create-user.dto';
import { UsersService } from '@modules/users/users.service';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOne(username);
    console.log(user.password);
    console.log(pass);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid) {
        const userObj = {
          ...user.toObject(),
        };
        return userObj;
      }
    }
    return null;
  }

  createRefreshToken(payload) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')) / 1000,
    });
    return refreshToken;
  }

  async login(user: IUser, res: Response) {
    const { _id, username } = user;
    const _user = await this.usersService.findOne(username);
    let profileImageUrl = null;
    if (_user && _user.profileImageUrl) {
      profileImageUrl = _user.profileImageUrl;
    }
    const payload = {
      username: username,
      profileImageUrl,
      _id: _id,
      sub: 'token login',
      iss: 'from server',
    };
    console.log(payload);
    const refreshToken = this.createRefreshToken(payload);
    await this.usersService.updateUserRefreshToken(
      _id.toString(),
      refreshToken,
    );
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge:
        ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')) / 1000,
    });
    return {
      accessToken: this.jwtService.sign(payload),
      _id: _id,
      profileImageUrl,
      username: username,
      sub: 'token login',
      iss: 'from server',
    };
  }

  async checkUserAccount(username: string) {
    const user = await this.usersService.findOne(username);
    console.log(user);
    if (user) {
      return user.username;
    }
    return null;
  }

  async register(userRegiserDto: UserRegisterDto, res: Response) {
    try {
      const user = await this.usersService.register(userRegiserDto);
      if (user) {
        const payload = {
          username: user.username,
          profileImageUrl: user.profileImageUrl,
          _id: user._id,
          sub: 'token login',
          iss: 'from server',
        };
        const refreshToken = this.createRefreshToken(payload);
        await this.usersService.updateUserRefreshToken(
          user._id.toString(),
          refreshToken,
        );
        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          maxAge:
            ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')) /
            1000,
        });
        return {
          accessToken: this.jwtService.sign(payload),
          _id: user._id,
          profileImageUrl: user.profileImageUrl,
          username: user.username,
          sub: 'token login',
          iss: 'from server',
        };
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
