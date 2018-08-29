/**
 * @fileoverview Fix ups for typescript
 * @author regardingscot@gmail.com (PeterStJ)
 */

import { Request, AuthCredentials } from 'hapi';
import { User } from '../src/entity/user';

/**
 * Fix up some of the types in HAPI that we are augmenting
 * 1) request now has cookieAuth (from hapi-auth-cookie)
 * 2) AuthCredentials now contian a scope and the yser record
 */

declare module 'hapi' {
  
  interface Request {
    readonly cookieAuth: {
      set(session: object):void;
      ttl(milliseconds: number):void;
      clear(key?: string):void;
    }
  }

  interface AuthCredentials {
    user: User,
    scope: string
  }
}
