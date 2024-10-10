import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'lib/constants';

export const Role = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
