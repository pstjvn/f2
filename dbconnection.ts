/**
 * @fileoverview Provides the machincs to obtain the DB connection.
 * 
 * Because TypeORM takes care of this via the ormconfig.json file
 * we do not need to do anything here.
 * 
 * @author regardingscot@gmail.com (PeterStJ)
 */

import {createConnection} from "typeorm";

/**
 * Generates the DB connection to use in the app.
 * 
 * NOTE: Because we are using ActiveRecord style models we only need to
 * initialize it, but the connection should still be present in `server.app`.
 */
export const getConnection = async () => {
  try {
    const conn = await createConnection();
    return conn;
  } catch (e) {
    throw e;
  }
}