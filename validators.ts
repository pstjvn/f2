/**
 * @fileoverview Provides the validators to use in route configuration.
 * 
 * Mostly conatins payload parms and query validators. 
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
 * Validate the loading of users (/donnors && /advisors)
 */
export const users = {
  start: Joi.number().integer().min(0).default(0),
  count: Joi.number().integer().min(1).default(10),
  filter: Joi.string().default('')
};

/**
 * Validate the user id (/user/:id && /donnor/:id)
 */
export const getUser = {
  id: Joi.string().required()
};

/**
 * Validate payload for create and update donnor (/donnor)
 */
export const createDonnor = Joi.object().keys({
  id: Joi.string(),
  email: Joi.string().email({minDomainAtoms: 2}).required(),
  firstname: Joi.string().min(2).required(),
  lastname: Joi.string().min(2).required(),
  nickname: Joi.string(),
  cid: Joi.string()
});