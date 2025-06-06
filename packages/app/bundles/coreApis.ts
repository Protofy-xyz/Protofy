import {AdminAPIBundles} from 'protolib/bundles/coreApis'
import { PagesAPI } from '@bundles/pages/pagesAPI'
export default (app, context) => {
  AdminAPIBundles(app, context)
  PagesAPI(app, context)
}