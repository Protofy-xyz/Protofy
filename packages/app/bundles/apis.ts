import {APIBundles} from 'protolib/bundles/api'
import CustomAPI from '../apis'
import { ProtoMemDBAPI } from '@extensions/protomemdb/protomemdbAPI'
import {EventsActions} from '@extensions/events/eventsActions'

export default (app, context) => {
    ProtoMemDBAPI(app, context)
    APIBundles(app, context)
    CustomAPI(app, context)
    EventsActions(app, context)
}