
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { EventModel } from '.'
import {DataTable2, Chip, DataView, Tooltip} from 'protolib'
import moment  from 'moment'
import { ClipboardList } from '@tamagui/lucide-icons';
import { JSONViewer } from '../../components/jsonui'
import { usePrompt } from '../../context/PromptAtom'

const format = 'YYYY-MM-DD HH:mm:ss'
const EventIcons =  {}
export default {
    'admin/events': {
        component: ({pageState, sourceUrl, initialItems, pageSession}:any) => {
            usePrompt(() => `At this moment the user is browsing the events list page. The events list page allows to monitor system events. The list is updated automatically if any events occurs.
            An event can be a user created, invalid login attempt, successful login, file edit, file create, file update, and also system object modification events, like "product created", or "product updated".
            Events can be used to monitor the system, auditing pruposes, or to trigger API actions when a specific event happens.
            Events contain a path, in the form of: x/y/z, where each part of the path describes a part of the event identify.
            For example, a file creation event will be files/create/file. A directory creation would be files/create/directory.
            Auth events can be auth/login/success and auth/login/error.
            Events contain data, specific for the event type.
            `+ (
                initialItems.isLoaded?'Currently the system returned the following information: '+JSON.stringify(initialItems.data) : ''
            )) 
            return (<AdminPage title="Events" pageSession={pageSession}>
                <DataView
                    integratedChat
                    hideAdd
                    openMode="view"
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="event"
                    disableViewSelector={false}
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
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/events', ['admin'], {
            orderBy: "created",
            orderDirection: "desc"
        })
    }
}