import { AccountCreateInput } from 'prisma/generated/models';

export type TokenPayload = Required<
  Pick<AccountCreateInput, 'id' | 'username' | 'avatar'>
>;

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
