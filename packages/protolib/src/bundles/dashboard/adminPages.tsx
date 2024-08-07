import { AdminPage } from '../../components/AdminPage';
import { DashboardGrid } from '../../components/DashboardGrid';
import { DashboardCard } from '../../components/DashboardCard';
import { Image } from '../../components/Image';
import { withSession } from '../../lib/Session';
import { XStack, YStack, Text } from '@my/ui';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Protofy, API } from 'protobase'
import { useState, useEffect } from 'react';
import { getPendingResult } from 'protobase';
import { usePendingEffect } from '../../lib/usePendingEffect';
import { SSR } from '../../lib/SSR';
import { ServiceMemoryUsageChart, TotalMemoryUsage, TotalCPUUsage } from '../services/widgets';

const sourceUrl = '/adminapi/v1/dashboard'
const workspacesSourceUrl = '/adminapi/v1/workspaces'
const isProtected = Protofy("protected", false)



const itemsContent = [
    { key: 'a', content: <ServiceMemoryUsageChart title="Memory Usage" id={'a'}/>},
    { key: 'b', content: <TotalMemoryUsage title='Total Memory Usage' id={'b'}/>},
    { key: 'c', content: <TotalCPUUsage title='Total CPU Usage' id={'c'}/>},
    //     { key: 'f', content: <DashboardCard title='Box C' id={'d'}>
    //     <Text style={{ flex: 1, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    //         <Image url="/images/protofito.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    //     </Text>
    // </DashboardCard>},
];

const layouts = {
    lg: [
        { i: 'a', x: 0, y: 0, w: 6, h: 12, isResizable: false },
        { i: 'b', x: 6, y: 0, w: 3, h: 6, isResizable: false },
        { i: 'c', x: 6, y: 3, w: 3, h: 6, isResizable: false },
    ],
    md: [
        { i: 'a', x: 0, y: 0, w: 6, h: 12, isResizable: false },
        { i: 'b', x: 6, y: 0, w: 3, h: 4, isResizable: false },
        { i: 'c', x: 0, y: 2, w: 4, h: 5, isResizable: false },
    ],
    sm: [
        { i: 'a', x: 0, y: 0, w: 6, h: 12, isResizable: false },
        { i: 'b', x: 6, y: 0, w: 3, h: 4, isResizable: false },
        { i: 'c', x: 0, y: 2, w: 2, h: 5, isResizable: false },
    ],
};


export default {
    'dashboard': {
        component: ({ pageState, initialItems, pageSession, extraData }: any) => {
            const [workspaces, setWorkspaces] = useState(extraData?.workspaces ?? getPendingResult('pending'))
            usePendingEffect((s) => { API.get(workspacesSourceUrl, s) }, setWorkspaces, extraData?.workspaces)
            return (<AdminPage title="Dashboard" pageSession={pageSession}>
                <YStack flex={1} padding={20}>
                    <DashboardGrid items={itemsContent} layouts={layouts} borderRadius={10} padding={10} backgroundColor="white" />
                </YStack>
            </AdminPage>)
        },
        getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined))
    }
}