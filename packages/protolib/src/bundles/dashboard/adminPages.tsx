import { AdminPage } from '../../components/AdminPage';
import { DashboardGrid } from '../../components/DashboardGrid';
import { withSession } from '../../lib/Session';
import { YStack } from '@my/ui';
import { Protofy } from 'protobase'
import { SSR } from '../../lib/SSR';
import { useWorkspace } from '../../lib/useWorkspace';

const isProtected = Protofy("protected", false)

export default {
    'dashboard': {
        component: ({ pageState, initialItems, pageSession, extraData }: any) => {
            const workspace = useWorkspace()
            const layouts = workspace?.dashboards[0]?.layout
            const itemsContent = workspace?.dashboards[0]?.content

            return (<AdminPage title="Dashboard" pageSession={pageSession}>
                <YStack flex={1} padding={20}>
                    <DashboardGrid items={itemsContent} layouts={layouts} borderRadius={10} padding={10} backgroundColor="white" />
                </YStack>
            </AdminPage>)
        },
        getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined))
    }
}