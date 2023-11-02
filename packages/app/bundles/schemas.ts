import { UserSchema } from 'protolib/adminpanel/bundles/users/usersSchemas'
import { GroupSchema } from 'protolib/adminpanel/bundles/groups/groupsSchemas'
import { EventSchema } from 'protolib/adminpanel/bundles/events/eventsSchemas'
import { ObjectSchema } from 'protolib/adminpanel/bundles/objects/objectsSchemas'
import LocalSchemas from './custom/schemas'

const Schemas = {
    event: EventSchema,
    user: UserSchema,
    group: GroupSchema,
    object: ObjectSchema,
    ...LocalSchemas,
}

export default Schemas