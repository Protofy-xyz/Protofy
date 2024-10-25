import { setConfig, initSchemaSystem } from 'protobase';
import { getBaseConfig } from '@my/config'
setConfig(getBaseConfig("next", process))
import { AppConfig } from '../conf'
import getApp from 'app/features/app'
initSchemaSystem()

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css')
}

const app = getApp(AppConfig)
export default app
