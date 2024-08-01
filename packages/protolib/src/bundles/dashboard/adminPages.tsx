import { AdminPage } from '../../components/AdminPage';
import { DashboardGrid } from '../../components/DashboardGrid';
import { withSession } from '../../lib/Session';
import { YStack } from '@my/ui';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Protofy, API } from 'protobase'
import { useState } from 'react';
import { getPendingResult } from 'protobase';
import { usePendingEffect } from '../../lib/usePendingEffect';
import { SSR } from '../../lib/SSR';

const sourceUrl = '/adminapi/v1/dashboard'
const workspacesSourceUrl = '/adminapi/v1/workspaces'
const isProtected = Protofy("protected", false)

const items = [
    { key: 'a', x: 0, y: 0, w: 5, h: 2, content: 'A' },
    { key: 'b', x: 2, y: 0, w: 2, h: 2, content: 'B' },
    { key: 'c', x: 4, y: 0, w: 2, h: 5, content: 'C' },
    { key: 'd', x: 10, y: 0, w: 5, h: 2, content: 'D' },
    { key: 'e', x: 20, y: 0, w: 2, h: 2, content: 'E' },
    { key: 'f', x: 40, y: 0, w: 2, h: 5, content: 'F' },
];


export default {
    'dashboard': {
        component: ({ pageState, initialItems, pageSession, extraData }: any) => {
            const [workspaces, setWorkspaces] = useState(extraData?.workspaces ?? getPendingResult('pending'))
            usePendingEffect((s) => { API.get(workspacesSourceUrl, s) }, setWorkspaces, extraData?.workspaces)
            return (<AdminPage title="Dashboard" pageSession={pageSession}>
                <YStack flex={1} padding={20}>
                    <DashboardGrid items={items} borderRadius={10} padding={10} backgroundColor="white"/>
                </YStack>
            </AdminPage>)
        },
        getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined))
    }
}