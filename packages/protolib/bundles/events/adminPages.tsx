import { EventModel } from '.'
import { DataTable2, Chip, DataView, AdminPage, InputSelect, useWorkspaceEnv } from 'protolib'
import moment from 'moment'
import { ClipboardList } from '@tamagui/lucide-icons';
import { JSONViewer } from '../../components/jsonui'
import { usePrompt } from '../../context/PromptAtom'
import { useEffect, useState } from 'react';
import { API, getPendingResult } from '../../base';
import { usePendingEffect } from '../../lib/usePendingEffect';
import { Paragraph, XStack } from 'tamagui';
import { Tinted } from '../../components/Tinted';
import { PaginatedData, SSR } from '../../lib/SSR';
import { withSession } from '../../lib/Session';


const format = 'HH:mm:ss DD-MM-YYYY'
const EventIcons = {}
const sourceUrl = '/adminapi/v1/events'

export default {
    'events': {
        component: ({ pageState, initialItems, pageSession }: any) => {
            const env = useWorkspaceEnv()
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
                    integratedChat
                    hideAdd
                    openMode="view"
                    sourceUrl={sourceUrl}
                    sourceUrlParams={{ env }}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="event"
                    disableViewSelector={false}
                    defaultView={'list'}
                    rowIcon={ClipboardList}
                    quickRefresh={true}
                    columns={DataTable2.columns(
                        DataTable2.column("path", row => row.path, "path", undefined, true, '400px'),
                        DataTable2.column("user", row => row.user, "user", undefined, true, '200px'),
                        DataTable2.column("from", row => row.from, "from", (row) => <Chip key={row.rowId} text={row.from} color={'$gray5'} />, true),
                        DataTable2.column("created", row => row.created, "created", (row) => moment(row.created).format(format), true, '200px'),
                        DataTable2.column("inspect", row => row.payload, false, (row) => <JSONViewer
                            onChange={() => { }}
                            editable={false}
                            data={row.payload}
                            collapsible
                            compact={false}
                            defaultCollapsed={true}
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