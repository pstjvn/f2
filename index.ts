import * as Hapi from 'hapi';
import {routes} from './routes';
import {setAuthProperties} from './src/auth/auth';
import {getConnection} from './dbconnection';
import 'reflect-metadata';

const PORT = process.env.PORT || 8081;
const HOST = process.env.HOST || '127.0.0.1';

const server = new Hapi.Server({
  port: PORT,
  host: '127.0.0.1'
});

const init = async () => {
  await setAuthProperties(server);
  const conn = await getConnection();
  server.app = conn;
  server.route(routes);
  await server.start();
  console.log(`Server started on ${HOST}:${PORT}`);
}

/**
 * Auto start the server.
 */
(async () => {
  try {
    init();
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
})();
