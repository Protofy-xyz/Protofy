import { TaskPage } from './TaskPage'
import { TasksPage } from './TasksPage'

export default {
    'admin/tasks': TasksPage,
    'admin/tasks/*': TaskPage
}