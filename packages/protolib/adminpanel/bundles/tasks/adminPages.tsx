
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { TaskModel } from './models/Task'
import {DataView, DataTable2, Chip, API} from 'protolib'
const Icons =  {}

export default {
    'admin/tasks': {
        component: ({workspace, pageState, sourceUrl, initialItems, pageSession}:any) => {
            return (<AdminPage title="Tasks" workspace={workspace} pageSession={pageSession}>
                <DataView
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="task"
                    // hideAdd={true}
                    model={TaskModel} 
                    pageState={pageState}
                    icons={Icons}
                />
            </AdminPage>)
        }, 
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/tasks')
    }
}