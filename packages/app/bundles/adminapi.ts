import {UsersAPI} from 'protolib/adminpanel/bundles/users/usersAPI'
import {EventsAPI} from 'protolib/adminpanel/bundles/events/eventsAPI'
import {GroupsAPI} from 'protolib/adminpanel/bundles/groups/groupsAPI'
export default (app) => {
    UsersAPI(app)
    GroupsAPI(app)
    EventsAPI(app)
}