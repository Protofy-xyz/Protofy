import {APIBundles} from 'protolib/bundles/api'
import CustomAPI from '../apis'

export default (app, context) => {
    APIBundles(app, context), 
    CustomAPI(app, context)
}