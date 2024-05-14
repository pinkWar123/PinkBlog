import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local-strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { RolesModule } from '@modules/roles/roles.module';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    RolesModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn:
              ms(configService.get<string>('JWT_ACCESS_TOKEN_EXPIRE')) / 1000,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
