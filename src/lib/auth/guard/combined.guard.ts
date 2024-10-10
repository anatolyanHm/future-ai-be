import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'lib/constants';
import { CustomAuthGuard } from '../guard/auth.guard';
import { RoleGuard } from './role.guard';

@Injectable()
export class CombinedGuard implements CanActivate {
  constructor(
    private readonly customAuthGuard: CustomAuthGuard,
    private readonly roleGuard: RoleGuard,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const canActivateAuth = await this.customAuthGuard.canActivate(context);
    if (!canActivateAuth) {
      return false;
    }

    const canActivateRole = await this.roleGuard.canActivate(context);
    return canActivateRole;
  }
}
