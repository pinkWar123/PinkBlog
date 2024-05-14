import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUser } from 'src/types/user.type';
import { ConfigService } from '@nestjs/config';
import { RolesService } from '@modules/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private roleService: RolesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: IUser) {
    const { _id, username, name, profileImageUrl, role } = payload;
    const temp = (
      await this.roleService.findRoleById(role.toString())
    )?.toObject();
    return {
      _id,
      username,
      name,
      profileImageUrl,
      permissions: temp?.permissions ?? [],
    };
  }
}
