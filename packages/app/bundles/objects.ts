import { UserModel } from 'protolib/bundles/users/usersSchemas'
import { GroupModel } from 'protolib/bundles/groups/groupsSchemas'
import { EventModel } from 'protolib/bundles/events/eventsSchemas'
import { ObjectModel } from 'protolib/bundles/objects/objectsSchemas'
import LocalObjects from './custom/objects'

export const Objects = {
    event: EventModel,
    user: UserModel,
    group: GroupModel,
    object: ObjectModel,
    ...LocalObjects,
}
