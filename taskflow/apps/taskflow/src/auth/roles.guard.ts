import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {ROLES_KEY} from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route doesn't have the @Roles decorator, let them access it
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    // Check if the user's roles array includes at least one of the required roles
    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}
