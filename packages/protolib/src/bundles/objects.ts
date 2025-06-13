
import { KeyModel} from './keys/keysSchemas'
import { EventModel } from 'protobase'
import { ObjectModel } from './objects/objectsSchemas'
import { TokenModel } from './tokens/tokensSchemas'

export default {
    event: EventModel,
    object: ObjectModel,
    key: KeyModel,
    token: TokenModel
}