
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { EventModel } from '.'
import {z} from 'zod'
import {DataTable2, Chip, DataView, Tooltip} from 'protolib'
import moment  from 'moment'
import { Mail, Tag, Key, ClipboardList } from '@tamagui/lucide-icons';
import { JSONViewer } from '../../components/jsonui'

const format = 'YYYY-MM-DD HH:mm:ss'
const EventIcons =  {}
const rowsPerPage = 20
export default {
    'admin/events': {
        component: ({pageState, sourceUrl, initialItems, pageSession}:any) => {
            return (<AdminPage title="Events" pageSession={pageSession}>
                <DataView
                    hideAdd
                    openMode="view"
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="event"
                    disableViewSelector={true}
                    defaultView={'list'}
                    rowIcon={ClipboardList}
                    columns={DataTable2.columns(
                        DataTable2.column("path", "path", true, undefined, true, '250px'),
                        DataTable2.column("user", "user", true, undefined, true, '200px'),
                        DataTable2.column("from", "from", true, (row) => <Chip text={row.from} color={'$gray5'} />, true),
                        DataTable2.column("created", "created", true, (row) => moment(row.created).format(format), true, '200px'),
                        DataTable2.column("payload", "payload", false, (row) => Object.keys(row?.payload??[]).length?Object.keys(row.payload).map((k,i) => <Tooltip trigger={<Chip ml={i?'$2':'$0'} key={k} text={k} color={'$color5'} />}>{JSON.stringify(row.payload[k])}</Tooltip>):<Chip text='empty' color={'$gray5'} />, true, '200px'),
                        DataTable2.column("inspect", "payload", false, (row) => <JSONViewer
                            onChange={() => {}}
                            editable={false}
                            data={row.payload}
                            collapsible
                            compact={false}
                            defaultCollapsed={true}
                            //collapsedNodes={{0:{root: true}}}
                        />)
                    )}
                    // hideAdd={true}
                    model={EventModel} 
                    pageState={pageState}
                    icons={EventIcons}
                />
            </AdminPage>)
        }, 
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/events', [], {
            orderBy: "created",
            orderDirection: "desc"
        })
    }
}