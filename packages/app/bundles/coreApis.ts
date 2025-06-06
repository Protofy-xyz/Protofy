import {AdminAPIBundles} from 'protolib/bundles/coreApis'
import { PagesAPI } from '@bundles/pages/pagesAPI'
import { APIsAPI } from '@bundles/apis/api'
export default (app, context) => {
  AdminAPIBundles(app, context)
  PagesAPI(app, context)
  APIsAPI(app, context)
}