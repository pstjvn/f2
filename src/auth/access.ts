import * as Hapi from 'hapi';
import { UserRole } from '../../src/entity/user';

/**
 * Basic AUTh requirement.
 * 
 * This option only requires an user (i.e. coockie present) and verifies it
 * against the `verifyFunction` in the default strategy or the strategy set on
 * the route.
 */
export const RequiresAuth: Hapi.RouteOptionsAccess = {
    strategies: ['cuid'],
    mode: 'required'
};

/**
 * If assgned to a route's auth option it will require ADMIN or ADVISOR 
 * privileges to run the route, otherwise 401 is returned.
 */
export const RequireAdvisor: Hapi.RouteOptionsAccess = {
  ...RequiresAuth,
  access: [
    { scope: String(UserRole.ADVISOR) }, 
    { scope: String(UserRole.ADMIN) }
  ]
};

/**
 * If assigned to a route's auth option it will require DONNOR privileges
 * to run the route, otherwise 401 will be returned.
 */
export const RequireDonnor: Hapi.RouteOptionsAccess = {
  ...RequiresAuth,
  access: [{scope: String(UserRole.DONOR)}]
};