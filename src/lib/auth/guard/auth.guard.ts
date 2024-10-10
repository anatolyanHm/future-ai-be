import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { STRATEGIES } from '../../constants';

@Injectable()
export class CustomAuthGuard extends AuthGuard([
  STRATEGIES.ACCESS]) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
