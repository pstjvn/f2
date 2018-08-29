/// <reference path="../../types/hapi-auth-cookie.d.ts" />
import * as Hapi from 'hapi';
import a from 'hapi-auth-cookie';
import {User} from '../entity/user';
import {CookiedUserData} from './cookie';

/**
 * This is the object struct to pass down to handlers in routes and guards
 * and it contains the validity and the revived user data.
 */
interface ValidationResult {
  valid: boolean;
  credentials?: Hapi.AuthCredentials
};

/**
 * Uses the parsed cookie (as session) to verify the user and 
 * set up the credentials in the routing as a user record and correct scope.
 */
const validateAccountFromSessionCookie = async (
    request: Hapi.Request, 
    session: CookiedUserData) => {
  if (session) {
    
    console.log('Session info');
    console.log(session);
    // TODO: aybe user caching instead of asking the server on every request...?
    const user = await User.findOne({id: session.id});
    if (user) {
      const validationResult: ValidationResult = {
        valid: true,
        credentials: {
          user: user,
          scope: String(user.role)
        }
      };
  
      return validationResult;
    }
  }

  console.log('Could not revive session....');
  return <ValidationResult> {
    valid: false
  };

}

/**
 * Helper that sets up the auth strategy for the server.
 */
export const setAuthProperties = async (server: Hapi.Server) => {
  await server.register(a);
  server.auth.strategy('cuid', 'cookie', {
    cookie: 'cuid',
    password: 'Ak720^kqwjklakjke(HDn2pnre2opks)(*DjDPQq3lnqdliduaokxn9knf3owqin98nmp93anrlifi',
    ttl: 60 * 60 * 1000, // one hour
    keepAlive: true,
    isSecure: false,
    clearInvalid: true,
    validateFunc: validateAccountFromSessionCookie
  });
  // If this is set ALL routes will be required to go via the validation and
  // we do not want that in dev.
  // server.auth.default('cuid');
  return server;
};