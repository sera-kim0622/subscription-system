import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException('INVALID_TOKEN_PAYLOAD');
    }

    return userId;
  },
);
