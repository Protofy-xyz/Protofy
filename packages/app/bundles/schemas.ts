import {def} from 'protolib/base'
import { UserSchema } from 'protolib/adminpanel/bundles/users/usersSchemas'
import { GroupSchema } from 'protolib/adminpanel/bundles/groups/groupsSchemas'
import { EventSchema } from 'protolib/adminpanel/bundles/events/eventsSchemas'
import { ObjectSchema } from 'protolib/adminpanel/bundles/objects/objectsSchemas'

const Schemas = def("schemas", {
    event: EventSchema,
    user: UserSchema,
    group: GroupSchema,
    object: ObjectSchema,
})

export default Schemas