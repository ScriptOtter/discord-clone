import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Account } from 'prisma/generated/browser';

export const Authorized = createParamDecorator(
  (
    data: keyof Pick<Account, 'id' | 'email' | 'phone' | 'username'>,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);
    const { password, __v, ...account } = user;
    return data ? account[data] : account;
  },
);
