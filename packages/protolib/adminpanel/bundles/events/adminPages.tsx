
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
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
        component: ({workspace, pageState, sourceUrl, initialItems, pageSession}:any) => {
            return (<AdminPage title="Events" workspace={workspace} pageSession={pageSession}>
                <DataView
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="event"
                    columns={DataTable2.columns(
                        DataTable2.column("path", "path", true, undefined, true, '250px'),
                        DataTable2.column("user", "user", true, undefined, true, '200px'),
                        DataTable2.column("from", "from", true, (row) => <Chip text={row.from} color={'$gray5'} />, true),
                        DataTable2.column("crated", "created", true, (row) => moment(row.created).format(format), true, '200px'),
                        DataTable2.column("payload", "payload", true, (row) => <pre>{JSON.stringify(row.payload, null, 4)}</pre>),
                    )}
                    // hideAdd={true}
                    model={EventModel} 
                    pageState={pageState}
                    icons={EventIcons}
                />
            </AdminPage>)
        }, 
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/events')
    }
}