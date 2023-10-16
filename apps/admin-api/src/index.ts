import dotenv from 'dotenv'
// get config vars
dotenv.config();

import http from 'http';
import app from './api'

const server = http.createServer(app);
server.listen(3002, () => {
  console.log(`Express server listening at http://localhost:${3002}`);
});
