
import { setConfig, initSchemaSystem } from 'protobase';
import { getBaseConfig } from '@my/config'
setConfig(getBaseConfig("electron", process))
import { AppConfig } from '../conf'
import getApp from 'app/features/app'
initSchemaSystem()

const app = getApp(AppConfig)
export default app
