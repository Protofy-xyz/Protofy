import { EventModel } from 'protobase'
import { Chip } from 'protolib/components/Chip'
import { DataTable2 } from 'protolib/components/DataTable2'
import { DataView } from 'protolib/components/DataView'
import { AdminPage } from 'protolib/components/AdminPage'
import moment from 'moment'
import { ClipboardList } from '@tamagui/lucide-icons';
import { JSONView } from 'protolib/components/JSONView'
import { usePrompt } from 'protolib/context/PromptAtom'
import { SSR } from 'protolib/lib/SSR';
import { withSession } from 'protolib/lib/Session';

const format = 'HH:mm:ss DD-MM-YYYY'
const EventIcons = {}
const sourceUrl = '/api/core/v1/events'

export default {
    'events': {
        component: ({ pageState, initialItems, pageSession }: any) => {
            usePrompt(() => `At this moment the user is browsing the events list page. The events list page allows to monitor system events. The list is updated automatically if any events occurs.
            An event can be a user created, invalid login attempt, successful login, file edit, file create, file update, and also system object modification events, like "product created", or "product updated".
            Events can be used to monitor the system, auditing pruposes, or to trigger API actions when a specific event happens.
            Events contain a path, in the form of: x/y/z, where each part of the path describes a part of the event identify.
            For example, a file creation event will be files/create/file. A directory creation would be files/create/directory.
            Auth events can be auth/login/success and auth/login/error.
            Events contain data, specific for the event type.
            `+ (
                    initialItems?.isLoaded ? 'Currently the system returned the following information: ' + JSON.stringify(initialItems.data) : ''
                ))

            return (<AdminPage title="Events" pageSession={pageSession}>
                <DataView
                    hideAdd
                    openMode="view"
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="event"
                    disableViewSelector={false}
                    defaultView={'list'}
                    quickRefresh={true}
                    columns={DataTable2.columns(
                        DataTable2.column("path", row => row.path, "path", undefined, true, '400px'),
                        DataTable2.column("user", row => row.user, "user", undefined, true, '200px'),
                        DataTable2.column("from", row => row.from, "from", (row) => <Chip key={row.rowId} text={row.from} color={'$gray5'} />, true),
                        DataTable2.column("created", row => row.created, "created", (row) => moment(row.created).format(format), true, '200px'),
                        DataTable2.column("inspect", row => row.payload, false, (row) => <JSONView
                            collapsed={true}
                            src={row.payload}
                        />)
                    )}
                    // hideAdd={true}
                    model={EventModel}
                    pageState={pageState}
                    icons={EventIcons}
                />
            </AdminPage>)
        },
        getServerSideProps: SSR(async (context) => withSession(context, ['admin']))
    }
}