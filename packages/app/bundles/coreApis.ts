import {AdminAPIBundles} from 'protolib/bundles/coreApis'
import { PagesAPI } from '@extensions/pages/pagesAPI'
import { APIsAPI } from '@extensions/apis/api'
import { ArduinosAPI } from '@extensions/arduino/arduinosAPI'
import { AssetsAPI } from '@extensions/assets/assetsAPI'
import { AssistantAPI } from '@extensions/assistant/assistantAPI'
import { AutomationsAPI } from '@extensions/automations/automationsAPI'
import { BoardsAPI } from '@extensions/boards/boardsAPI'
export default (app, context) => {
  AdminAPIBundles(app, context)
  PagesAPI(app, context)
  APIsAPI(app, context)
  ArduinosAPI(app, context)
  AssetsAPI(app, context)
  AssistantAPI(app, context)
  AutomationsAPI(app, context)
  BoardsAPI(app, context)
}