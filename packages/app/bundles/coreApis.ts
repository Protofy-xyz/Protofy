import {AdminAPIBundles} from 'protolib/bundles/coreApis'
import { PagesAPI } from '@bundles/pages/pagesAPI'
import { APIsAPI } from '@bundles/apis/api'
import { ArduinosAPI } from '@bundles/arduino/arduinosAPI'
import { AssetsAPI } from '@bundles/assets/assetsAPI'
import { AssistantAPI } from '@bundles/assistant/assistantAPI'
import { AutomationsAPI } from '@bundles/automations/automationsAPI'

export default (app, context) => {
  AdminAPIBundles(app, context)
  PagesAPI(app, context)
  APIsAPI(app, context)
  ArduinosAPI(app, context)
  AssetsAPI(app, context)
  AssistantAPI(app, context)
  AutomationsAPI(app, context)
}