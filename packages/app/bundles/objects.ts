import { UserModel } from 'protolib/adminpanel/bundles/users/usersSchemas'
import { GroupModel } from 'protolib/adminpanel/bundles/groups/groupsSchemas'
import { EventModel } from 'protolib/adminpanel/bundles/events/eventsSchemas'
import { ObjectModel } from 'protolib/adminpanel/bundles/objects/objectsSchemas'
import LocalObjects from './custom/objects'

export const Schemas = {
    event: EventModel,
    user: UserModel,
    group: GroupModel,
    object: ObjectModel,
    ...LocalObjects,
}
