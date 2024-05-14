import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/public';
import { IS_PUBLIC_PERMISSION } from 'src/decorators/skip-permission';
import { IUser } from 'src/types/user.type';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    // You can throw an exception based on either "info" or "err" arguments
    const request: Request = context.switchToHttp().getRequest();

    const isSkipPermission = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_PERMISSION,
      [context.getHandler(), context.getClass()],
    );

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const targetMethod = request.method;
    const targetEndpoint = request?.route.path as string;
    const permissions = user?.permissions ?? [];

    let isExisted = permissions.some(
      (permission) =>
        targetMethod === permission.method &&
        targetEndpoint === '/api/v1' + permission.apiPath,
    );

    if (targetEndpoint.startsWith('/api/v1/auth')) isExisted = true;

    if (!isExisted && !isSkipPermission) {
      throw new ForbiddenException('Forbidden resource');
    }

    return user;
  }
}
