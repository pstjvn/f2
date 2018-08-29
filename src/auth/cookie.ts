import {User, UserRole} from '../entity/user';

/**
 * Describe the user session attributes preserved in cookie. Note
 * that the validation function used in default strategy is responsible for 
 * reviving the user record from the ID alone, so we do not need to
 * pass additional data in the cookie.
 * 
 * One MUST check if the account still exists and that is still has the correct
 * privileges.
 */
export interface CookiedUserData {
  id: string
}

/**
 * Given a user record (as from AR models) creates a new cookie data record
 * to tranfer / revive as session object.
 * 
 * It sets the scope in the session as well to allow for routing
 * based on the user role.
 */
export const createCookieData = (user: User): CookiedUserData => {
  const data: CookiedUserData = {
    id: user.id
  };
  return data;
}