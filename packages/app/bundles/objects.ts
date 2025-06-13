import ProtolibObjects from 'protolib/bundles/objects'
import { ObjectModel } from '@extensions/objects/objectsSchemas'
import { PageModel } from '@extensions/pages/pagesSchemas'
import { APIModel } from '@extensions/apis/APISchemas'
import { BoardModel } from '@extensions/boards/boardsSchemas'
import { WorkspaceModel } from '@extensions/workspaces/WorkspaceModel'
import { UserModel } from '@extensions/users/usersSchemas'
import { GroupModel } from '@extensions/groups/groupsSchemas'
import { KeyModel} from '@extensions/keys/keysSchemas'

import LocalObjects from '../objects'

export const Objects = {
    ...ProtolibObjects,
    ...LocalObjects,
    page: PageModel,
    api: APIModel,
    board: BoardModel,
    workspace: WorkspaceModel,
    user: UserModel,
    group: GroupModel,
    key: KeyModel,
    object: ObjectModel
}
