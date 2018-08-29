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

export const routes = [index, login, logout, test];