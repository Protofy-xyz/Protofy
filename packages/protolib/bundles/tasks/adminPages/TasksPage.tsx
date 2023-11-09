
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { TaskModel } from '../models/Task'
import {DataView, DataTable2, Chip, API} from 'protolib'
import { useRouter } from "next/router"

export const TasksPage = {
    component: ({workspace, pageState, sourceUrl, initialItems, pageSession}:any) => {
        const router = useRouter()

        return (<AdminPage title="Tasks" workspace={workspace} pageSession={pageSession}>
            <DataView
                onSelectItem={(item) => {
                    router.push('/admin/tasks/'+item.getId())
                }}
                disableViewSelector={true}
                defaultView={'list'}
                sourceUrl={sourceUrl}
                initialItems={initialItems}
                numColumnsForm={1}
                name="task"
                columns={DataTable2.columns(
                    DataTable2.column("name", "name", true, undefined, true, '350px'),
                    DataTable2.column("api", "api", true, row => <Chip text={row.api?'yes':'no'} color={row.api ? '$color5':'$gray5'} />, true),
                    DataTable2.column("api route", "apiRoute", true)
                    // DataTable2.column("type", "type", true, row => <Chip text={row.type.toUpperCase()} color={row.type == 'admin' ? '$color5':'$gray5'} />),
                    // DataTable2.column("from", "from", true, row => <Chip text={row.from?.toUpperCase()} color={row.from == 'cmd' ? '$blue5':'$gray5'} />),
                    // DataTable2.column("created", "createdAt", true, row => moment(row.createdAt).format(format)),
                    // DataTable2.column("last login", "lastLogin",true, row => row.lastLogin ? <Chip text={moment(row.lastLogin).format(format)} color={'$gray5'} /> : <Chip text={'NEVER'} color={'$yellow6'} /> )
                )}
                // hideAdd={true}
                model={TaskModel} 
                pageState={pageState}
                icons={{}}
            />
        </AdminPage>)
    }, 
    getServerSideProps: PaginatedDataSSR('/adminapi/v1/tasks')
}