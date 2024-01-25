import dotenv from 'dotenv'
import {setLoggerConfig, getLogger } from 'protolib/base/logger';
setLoggerConfig({name: "api"})

const logger = getLogger()
// get config vars
dotenv.config({ path: '../../.env' });

import http from 'http';
import app from './api'
import {generateEvent} from 'app/bundles/library'

const isProduction = process.env.NODE_ENV === 'production';

const server = http.createServer(app);
const PORT = isProduction?4001:3001

server.listen(PORT, () => {
  logger.info(`Express server listening at http://localhost:${PORT}`);
});

// generateEvent({
//   path: 'services/start/api', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
//   from: 'api', // system entity where the event was generated (next, api, cmd...)
//   user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
//   payload: {}, // event payload, event-specific data
// })



  
