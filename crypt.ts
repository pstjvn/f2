/**
 * @fileoverview Implements the password hashing machincs for the app.
 * 
 * @author regardingscot@gmail.com (PeterStJ)
 */

import * as bcrypt from 'bcrypt';

/**
 * This is the default in the npm package as well, seem to be agreed that 10 is
 * enough. 
 */
const SALT_ROUNDS: number = 10;

/**
 * Given a plain text password generate a new hash that can be stored in the DB.
 */
export const hashPassword = async (pass: string): Promise<string> => {
  return bcrypt.hash(pass, SALT_ROUNDS);
}

/**
 * Given a plain text password and a previously generated hash determines if the 
 * paswords match.
 * 
 * Note: This is MANDATORY and hashes should NOT be compared as string
 */
export const passwordMatches = async (plaintext: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plaintext, hashed);
}