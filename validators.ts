/**
 * @fileoverview Provides the validators to use in route configuration.
 * 
 * Mostly conatins payload validators. 
 * 
 * @author regardingscot@gmail.com (PeterStJ)
 */

import * as Joi from 'joi';

/**
 * Scheme to validate the login payload credentials.
 */
export const login = Joi.object().keys({
  // Login is email address in our usecase case
  username: Joi.string().email({minDomainAtoms: 2}).required(),
  // Alphanumerical, at least one digit, min 6 chars.
  password: Joi.string().alphanum().min(6).max(50).regex(/[0-9]/).required()
});

/**
 * Validate the loading of users (/users)
 */
export const users = {
  start: Joi.number().integer().min(0).default(0),
  count: Joi.number().integer().min(1).default(10),
  filter: Joi.string().default('')
};

/**
 * Validate the user id (/user/:id)
 */
export const getUser = {
  id: Joi.string().required()
}