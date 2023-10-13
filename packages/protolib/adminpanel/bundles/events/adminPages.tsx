
import {AdminPage, SSR} from 'protolib/adminpanel/features/next'
import { EventModel } from '.'
import {z} from 'zod'
import {DataTable2, Chip, DataView} from 'protolib'
import moment  from 'moment'
import { Mail, Tag, Key } from '@tamagui/lucide-icons';

const format = 'YYYY-MM-DD HH:mm:ss'
const EventIcons =  {}
const rowsPerPage = 20
export default {
    'admin/events': {
        component: ({workspace, initialItems, pageSession}:any) => {
            return (<AdminPage title="Events" workspace={workspace} pageSession={pageSession}>
                <DataView
                    numColumnsForm={2}
                    name="event"
                    // hideAdd={true}
                    columns={DataTable2.columns(
                        DataTable2.column("path", "path", true),
                        DataTable2.column("from", "from", true, row => <Chip text={row.type.toUpperCase()} color={'$blue5'} />),
                        DataTable2.column("user", "user", true, row => <Chip text={row.user.toUpperCase()} color={'$color5'} />),
                        DataTable2.column("created", "created", true, row => moment(row.created).format(format)),
                        DataTable2.column("status", "status",true, row => <Chip text={row.status.toUpperCase()} color={'$yellow6'} /> ),
                        DataTable2.column("lastUpdated", "lastUpdated", true, row => moment(row.lastUpdated).format(format))
                    )}
                    model={EventModel} 
                    sourceUrl="/adminapi/v1/events" 
                    initialItems={initialItems} 
                    icons={EventIcons}
                    rowsPerPage={rowsPerPage} 
                />
            </AdminPage>)
        }, 
        getServerSideProps: SSR('/adminapi/v1/events?itemsPerPage='+rowsPerPage)
    }
}