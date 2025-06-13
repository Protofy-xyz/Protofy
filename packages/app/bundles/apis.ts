import {APIBundles} from 'protolib/bundles/api'
import CustomAPI from '../apis'
import { UsersActions } from '@extensions/users/usersActions'
import { GroupsActions } from '@extensions/groups/groupsActions'
import { ProtoMemDBAPI } from '@extensions/protomemdb/protomemdbAPI'
import {EventsActions} from '@extensions/events/eventsActions'
import { AutomationsActions } from '@extensions/apis/automationsActions'
import { PagesActions } from '@extensions/pages/pagesActions'
import { DiscordAPI } from '@extensions/discord/discordAPI'
import { WhatsappAPI } from '@extensions/whatsapp/whatsappAPI'
import { FlowAPI } from '@extensions/flow/flowAPI';

export default (app, context) => {
    ProtoMemDBAPI(app, context)
    APIBundles(app, context)
    CustomAPI(app, context)
    UsersActions(app, context)
    GroupsActions(app, context)
    EventsActions(app, context)
    AutomationsActions(app, context)
    PagesActions(app, context)
    DiscordAPI(app, context)
    WhatsappAPI(app, context)
    FlowAPI(app, context)
}