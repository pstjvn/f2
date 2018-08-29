/// <reference path="types/hapi.d.ts" />
/**
 * @fileoverview Provides all handlers for all routes in the app.
 * 
 * @author regadingscot@gmail.com (PeterStJ)
 */

import * as Hapi from 'hapi';
import {User} from './src/entity/user';
import {passwordMatches} from './crypt';
import {createCookieData} from './src/auth/cookie';

/**
 * The payload type to expect when logging in.
 */
interface LoginCredentials {
  username: string,
  password: string
}

/**
 * Allow clients to load an empty HTML document so we can run test on it.
 */
export const index = (request: Hapi.Request, hapi: Hapi.ResponseToolkit) => {
  return `<!doctype html><html><head></head><body></body></html>`;  
};

/**
 * Allow the users to log in with credentials.
 */
export const login = async (req: Hapi.Request, hapi: Hapi.ResponseToolkit) => {
  // Unfortunately for us Hapi.Request.payoad is typed as 'string',
  // but validating it via Joi turns the payload into an Object and here we want
  // to use that type information. TS allows us to make this using typeof operator
  if (typeof req.payload === 'object') {
    const pl: LoginCredentials = <LoginCredentials>req.payload;
    const user = await User.findOne({
      email: pl.username
    });
    if (user) {
      const passmatches = await passwordMatches(pl.password, user.password);
      if (passmatches) {
        req.cookieAuth.set(createCookieData(user));
        return {
          ...user,
          password: ''
        };
      }
    } 
    // Fall through logic - if no user return this instead.
    req.cookieAuth.clear();
    return hapi.response({
      msg: 'Email or password not valid'
    }).code(401);
  } // no payload is handled by JOI rejecting the request in validation phase.
};

/**
 * Test route, you can put here any test logic needed for ongoing development.
 */
export const test = async (req: Hapi.Request, hapi: Hapi.ResponseToolkit) => {
  // // Contains the user info.
  console.log(req.auth.credentials);
  // Example how to use user from request.
  const user = req.auth.credentials.user;
  return {status: 'OK'};
};

/**
 * Allow users to log out from the system.
 */
export const logout = async (req: Hapi.Request, hapi: Hapi.ResponseToolkit) => {
  req.cookieAuth.clear();
  return {status: 'OK'};
};