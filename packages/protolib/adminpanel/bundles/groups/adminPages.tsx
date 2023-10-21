
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { GroupModel } from '.'
import {z} from 'zod'
import {DataTable2, Chip, DataView} from 'protolib'
import moment  from 'moment'
import { Mail, Tag, Key, User, Group } from '@tamagui/lucide-icons';
const GroupIcons =  {}

export default {
    'admin/groups': {
        component: ({workspace, pageState, sourceUrl, initialItems, pageSession}:any) => {
            return (<AdminPage title="Groups" workspace={workspace} pageSession={pageSession}>
                <DataView
                    disableViewSelector
                    rowIcon={Group}
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={2}
                    name="group"
                    columns={DataTable2.columns(
                    )}
                    model={GroupModel} 
                    pageState={pageState}
                    icons={GroupIcons}
                    dataTableCardProps={{itemMinWidth: 300}}
                />
            </AdminPage>)
        }, 
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/groups', ['admin'],{
            view: 'raw'
        })
    }
}