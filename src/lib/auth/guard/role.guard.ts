import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { app } from 'firebase-admin';

const ROLES = 'roles';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    @Inject('FIREBASE_APP') private readonly firebaseApp: app.App,
    private readonly reflector: Reflector,
  ) {}

  matchRoles(roles: string[], userRole: any) {
    return roles.some((role) => role === userRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(ROLES, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const role = await this.firebaseApp
      .firestore()
      .collection('roles')
      .doc(user.uid)
      .get();

    return this.matchRoles(roles, role.get('role'));
  }
}
