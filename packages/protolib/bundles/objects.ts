import { UserModel } from './users/usersSchemas'
import { GroupModel } from './groups/groupsSchemas'
import { KeyModel} from './keys/keysSchemas'
import { EventModel } from './events/eventsSchemas'
import { ObjectModel } from './objects/objectsSchemas'
import { WorkspaceModel } from './workspaces/WorkspaceModel'
import { APIModel } from './apis/APISchemas'
import { PageModel } from './pages/pagesSchemas'

export default {
    event: EventModel,
    user: UserModel,
    group: GroupModel,
    object: ObjectModel,
    key: KeyModel,
    workspace: WorkspaceModel,
    api: APIModel,
    page: PageModel,
}