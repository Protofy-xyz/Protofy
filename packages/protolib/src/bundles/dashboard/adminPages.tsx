import { AdminPage } from '../../components/AdminPage';
import { withSession } from '../../lib/Session';
import { YStack, Text } from '@my/ui';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Protofy, API } from 'protobase'
import { usePrompt } from '../../context/PromptAtom'
import { useState } from 'react';
import { getPendingResult } from 'protobase';
import { usePendingEffect } from '../../lib/usePendingEffect';
import { PaginatedData, SSR } from '../../lib/SSR';

const sourceUrl = '/adminapi/v1/dashboard'
const workspacesSourceUrl = '/adminapi/v1/workspaces'
const isProtected = Protofy("protected", false)

const layout = [
    { i: 'a', x: 0, y: 0, w: 5, h: 2 },
    { i: 'b', x: 2, y: 0, w: 2, h: 2 },
    { i: 'c', x: 4, y: 0, w: 2, h: 5 },
    { i: 'd', x: 10, y: 0, w: 5, h: 2 },
    { i: 'e', x: 20, y: 0, w: 2, h: 2 },
    { i: 'f', x: 40, y: 0, w: 2, h: 5 },
];

export default {
    'dashboard': {
        component: ({ pageState, initialItems, pageSession, extraData }: any) => {
            const [workspaces, setWorkspaces] = useState(extraData?.workspaces ?? getPendingResult('pending'))
            usePendingEffect((s) => { API.get(workspacesSourceUrl, s) }, setWorkspaces, extraData?.workspaces)
            return (<AdminPage title="Dashboard" pageSession={pageSession}>
                <YStack flex={1} padding={20}>
                    <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
                        <YStack key="a" backgroundColor="#f0f0f0" borderRadius={10} padding={10}>
                            <Text>A</Text>
                        </YStack>
                        <YStack key="b" backgroundColor="#d0d0d0" borderRadius={10} padding={10}>
                            <Text>B</Text>
                        </YStack>
                        <YStack key="c" backgroundColor="#b0b0b0" borderRadius={10} padding={10}>
                            <Text>C</Text>
                        </YStack>
                        <YStack key="d" backgroundColor="#b0b0b0" borderRadius={10} padding={10}>
                            <Text>C</Text>
                        </YStack>
                        <YStack key="e" backgroundColor="#b0b0b0" borderRadius={10} padding={10}>
                            <Text>C</Text>
                        </YStack>
                        <YStack key="f" backgroundColor="#b0b0b0" borderRadius={10} padding={10}>
                            <Text>C</Text>
                        </YStack>
                    </GridLayout>
                </YStack>
            </AdminPage>)
        },
        getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined))
    }
}