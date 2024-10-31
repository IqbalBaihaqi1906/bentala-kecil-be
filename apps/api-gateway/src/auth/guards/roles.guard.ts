import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleUser } from '@prisma/client';
import { ROLES_KEY } from '../decorators/role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: RoleUser[] = this.reflector.getAllAndOverride<RoleUser[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    if (requiredRoles.includes(user.role)) {
      return true;
    }

    return false;
  }
}
