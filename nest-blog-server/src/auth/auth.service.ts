import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/user.type';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user: IUser) {
    const payload = {
      username: user.username,
      sub: 'token login',
      iss: 'from server',
    };
    console.log(payload);
    return {
      access_token: this.jwtService.sign(payload),
      username: user.username,
      sub: 'token login',
      iss: 'from server',
    };
  }
}
