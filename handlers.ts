/// <reference path="types/hapi.d.ts" />
/**
 * @fileoverview Provides all handlers for all routes in the app.
 * 
 * @author regadingscot@gmail.com (PeterStJ)
 */

import * as Hapi from 'hapi';
import {User, UserRole} from './src/entity/user';
import {passwordMatches} from './crypt';
import {createCookieData} from './src/auth/cookie';
import {getRepository, Like, Raw, Brackets} from 'typeorm';
import { PasswordLink } from './src/entity/passwordlink';

/**
 * The payload type to expect when logging in.
 */
interface LoginCredentials {
  username: string,
  password: string
}

interface Users {
  start?: number,
  count?: number,
  filter?: number
}

interface UserDto {
  id?: string,
  email: string,
  firstname: string,
  lastname: string,
}

interface DonnorDto extends UserDto {
  cid?: string,
  nickname?: string,
  advisorId?: string
}

interface AdvisorDto extends UserDto {
  tel?: string
}

/**
 * Allow clients to load an empty HTML document so we can run test on it.
 */
export const index = (request: Hapi.Request, hapi: Hapi.ResponseToolkit) => {
  return `<!doctype html><html><head></head><body></body></html>`;  
};

/**
 * Allow to retrieve all users of type Donnor.
 * We assume that the guards are in place and we just return them here.
 */
export const donnors = async (req: Hapi.Request, hapi: Hapi.ResponseToolkit) => {
  const {start = 0, count = 10, filter = ''} = <Users>req.query;
  const query = getRepository(User)
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.DONOR })
  if (filter) {
    query.andWhere(new Brackets(qb => {
      qb.where(`user.firstname like "%${filter}%"`)
      .orWhere(`user.lastname like "%${filter}%"`)
    }));
  }
  const res = await query.leftJoinAndSelect('user.passwordLink', 'passwordLink')
      .orderBy('user.lastname')
      .offset(start)
      .limit(count)
      .getMany();
  return res.map(user => {
    return {
      ...user,
      password: ''
    };
  });
};

/**
 * Getter for a user record or deletion.
 */
export const getOrDeleteDonnor = async (req: Hapi.Request, hapi: Hapi.ResponseToolkit) => {
  const userid = <string>req.params.id;
  switch (req.method) {
    case 'get':
      return await User.findOne({id: userid});
    case 'delete': 
      return await User.delete({id: userid});
  }
};

export const createOrUpdateDonnor = async (req: Hapi.Request, hapi: Hapi.ResponseToolkit) => {
  const advisorID = req.auth.credentials.user.id;
  const pl = <DonnorDto>req.payload;
  if (req.method === 'post') {

  } else if (req.method === 'put') {
    if (pl.id) {
      const user = await User.findOne({id: pl.id})
      if (user) {
        
      }
    } else {
      hapi.response({
        msg: 'Unknown user'
      }).code(401);
    }

  } else {
    throw new Error('We should not get here.');
  }
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