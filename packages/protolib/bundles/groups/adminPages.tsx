
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { GroupModel } from '.'
import {z} from 'zod'
import {DataTable2, Chip, DataView} from 'protolib'
import moment  from 'moment'
import { Mail, Tag, Key, User, Users } from '@tamagui/lucide-icons';
const GroupIcons =  {}

export default {
    'admin/groups': {
        component: ({pageState, sourceUrl, initialItems, pageSession}:any) => {
            return (<AdminPage title="Groups" pageSession={pageSession}>
                <DataView
                    disableViewSelector
                    defaultView={'list'}
                    rowIcon={Users}
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="group"
                    // columns={DataTable2.columns(
                    // )}
                    model={GroupModel} 
                    pageState={pageState}
                    icons={GroupIcons}
                    dataTableCardProps={{itemMinWidth: 300}}
                />
            </AdminPage>)
        }, 
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/groups', ['admin'])
    }
}