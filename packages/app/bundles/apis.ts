import UsersActions from '@extensions/users/apis'
import GroupsActions from '@extensions/groups/apis'
import ProtoMemDBAPI from '@extensions/protomemdb/apis'
import EventsActions from '@extensions/events/apis'
import AutomationsActions from '@extensions/apis/apis'
import PagesActions from '@extensions/pages/apis'
import DiscordAPI from '@extensions/discord/apis'
import WhatsappAPI from '@extensions/whatsapp/apis'
import FlowAPI from '@extensions/flow/apis'
import KeysActions from '@extensions/keys/apis'
import DevicesActions from '@extensions/devices/devices/apis'
import PhpAPI from '@extensions/php/apis'
import MobileAPI from '@extensions/mobile/apis'
import ObjectUserAPI from '@extensions/objects/apis'
import ResourcesAPI from '@extensions/resources/apis'
import StateMachinesAPI from '@extensions/stateMachines/stateMachines/apis'


export default (app, context) => {
    ProtoMemDBAPI(app, context)
    UsersActions(app, context)
    GroupsActions(app, context)
    EventsActions(app, context)
    KeysActions(app, context)
    AutomationsActions(app, context)
    PagesActions(app, context)
    DiscordAPI(app, context)
    WhatsappAPI(app, context)
    FlowAPI(app, context)
    DevicesActions(app, context)
    PhpAPI(app, context)
    MobileAPI(app, context)
    ObjectUserAPI(app, context)
    ResourcesAPI(app, context)
    StateMachinesAPI(app, context)
}