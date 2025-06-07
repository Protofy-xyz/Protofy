import { UserModel } from './users/usersSchemas'
import { GroupModel } from './groups/groupsSchemas'
import { KeyModel} from './keys/keysSchemas'
import { EventModel } from 'protobase'
import { ObjectModel } from './objects/objectsSchemas'
import { WorkspaceModel } from './workspaces/WorkspaceModel'
import { TokenModel } from './tokens/tokensSchemas'

export default {
    event: EventModel,
    user: UserModel,
    group: GroupModel,
    object: ObjectModel,
    key: KeyModel,
    workspace: WorkspaceModel,
    token: TokenModel
}