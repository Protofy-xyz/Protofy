import UsersActions from '@extensions/users/apis'
import GroupsActions from '@extensions/groups/apis'
import ProtoMemDBAPI from '@extensions/protomemdb/apis'
import EventsActions from '@extensions/events/apis'
import AutomationsActions from '@extensions/apis/apis'
import { PagesActions } from '@extensions/pages/pagesActions'
import { DiscordAPI } from '@extensions/discord/discordAPI'
import { WhatsappAPI } from '@extensions/whatsapp/whatsappAPI'
import { FlowAPI } from '@extensions/flow/flowAPI'
import { KeysActions } from '@extensions/keys/keysActions'
import { DevicesActions } from '@extensions/devices/devices/devicesActions'
import { PhpAPI } from '@extensions/php/phpApi'
import { MobileAPI } from '@extensions/mobile/mobileAPI'
import { ObjectUserAPI } from '@extensions/objects/objectsUserAPI'
import { ObjectsActions } from '@extensions/objects/objectsActions'
import { ResourcesAPI } from '@extensions/resources/resourcesAPI'
import { StateMachinesAPI } from '@extensions/stateMachines/stateMachines/stateMachinesApi'

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
    ObjectsActions(app, context)
    ResourcesAPI(app, context)
    StateMachinesAPI(app, context)
}