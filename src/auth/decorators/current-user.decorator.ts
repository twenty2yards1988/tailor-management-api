import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import type { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

type CurrentUserProperty = keyof AuthenticatedUser;

export const CurrentUser = createParamDecorator<
  CurrentUserProperty | undefined,
  AuthenticatedUser | AuthenticatedUser[CurrentUserProperty]
>(
  (
    property: CurrentUserProperty | undefined,
    context: ExecutionContext,
  ): AuthenticatedUser | AuthenticatedUser[CurrentUserProperty] => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (property) {
      return request.user[property];
    }

    return request.user;
  },
);
