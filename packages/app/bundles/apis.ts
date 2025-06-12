import {APIBundles} from 'protolib/bundles/api'
import CustomAPI from '../apis'
import { UsersActions } from '@extensions/users/usersActions'
import { ProtoMemDBAPI } from '@extensions/protomemdb/protomemdbAPI'
import {EventsActions} from '@extensions/events/eventsActions'
import { AutomationsActions } from '@extensions/apis/automationsActions'
import { PagesActions } from '@extensions/pages/pagesActions'

export default (app, context) => {
    ProtoMemDBAPI(app, context)
    APIBundles(app, context)
    CustomAPI(app, context)
    UsersActions(app, context)
    EventsActions(app, context)
    AutomationsActions(app, context)
    PagesActions(app, context)
}