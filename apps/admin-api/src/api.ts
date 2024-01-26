import { app, getMQTTClient } from 'protolib/api'
import adminModules from 'protolib/adminapi'
import BundleAPI from 'app/bundles/adminapi'
import { getLogger } from 'protolib/base';

const logger = getLogger()
logger.debug({ adminModules }, 'Admin modules: ', JSON.stringify(adminModules))

BundleAPI(app, { mqtt: getMQTTClient() })
export default app