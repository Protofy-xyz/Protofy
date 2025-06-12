import { GroupModel } from './groups/groupsSchemas'
import { KeyModel} from './keys/keysSchemas'
import { EventModel } from 'protobase'
import { ObjectModel } from './objects/objectsSchemas'
import { TokenModel } from './tokens/tokensSchemas'

export default {
    event: EventModel,
    group: GroupModel,
    object: ObjectModel,
    key: KeyModel,
    token: TokenModel
}