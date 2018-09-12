import * as handlers from './handlers';
import * as validators from './validators';
import * as Hapi from 'hapi';
import {RequireAdvisor, RequiresAuth} from './src/auth/access';

/**
 * The main entry point (for tests with fetch). Will return HTML.
 */
export const index: Hapi.ServerRoute = {
  path: '/', 
  method: 'GET', 
  handler: handlers.index
};

/**
 * Login EP.
 * 
 * Here we need to change the MODE for auth in order to allow to actually attempt
 * the login.
 */
export const login: Hapi.ServerRoute = {
  path: '/login', 
  method: 'POST', 
  handler: handlers.login,
  options: {
    auth: {
      strategies: ['cuid'],
      mode: 'try'
    },
    validate: {
      payload: validators.login
    }
  }
};

export const test: Hapi.ServerRoute = {
  path: '/test',
  method: 'GET',
  handler: handlers.test,
  options: {
    auth: RequireAdvisor
  }
};

/**
 * Logout EP.
 */
export const logout: Hapi.ServerRoute = {
  path: '/logout', 
  method: 'GET', 
  handler: handlers.logout,
  options: {
    // Basic auth, we are only looking if the user exists.
    auth: RequiresAuth
  }
};

// TODO: see if this can be reworked into controllers, altough it would require
// generics that seem to not be supported by TS (Generic TypeOf instead of instance)
// ALternatively see https://github.com/typeorm/typeorm/blob/master/docs/active-record-data-mapper.md
// for creating custom repository.
export const donnors: Hapi.ServerRoute = {
  path: '/donnors',
  method: 'GET',
  handler: handlers.donnors,
  options: {
    auth: RequireAdvisor,
    validate: {
      query: validators.users
    }
  }
};

export const gddonnor: Hapi.ServerRoute = {
  path: '/donnor/:id',
  method: ['GET', 'DELETE'],
  handler: handlers.getOrDeleteDonnor,
  options: {
    auth: RequireAdvisor,
    validate: {
      params: validators.getUser
    }
  }
};

export const ppdonnor: Hapi.ServerRoute = {
  path: '/donnor/',
  method: ['POST', 'PUT'],
  handler: handlers.createOrUpdateDonnor,
  options: {
    auth: RequireAdvisor,
    validate: {
      payload: validators.createDonnor
    }
  }
};

export const routes = [index, login, logout, test, donnors, gddonnor, ppdonnor];