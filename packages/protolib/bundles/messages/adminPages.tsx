
import {AdminPage} from 'protolib/adminpanel/features/next'
import { SSR } from 'app/conf'
import { withSession } from 'protolib'
import { useSubscription } from 'mqtt-react-hooks';
import { H2 } from '@my/ui';

export default { 
    'admin/messages': {
        component: ({pageSession}:any) => {
            const { topic, client, message } = useSubscription('#');
            console.log('topic: ', topic, 'client: ', client, 'message: ', message)
            return (<AdminPage title="Messages" pageSession={pageSession}>
                <H2 mt={"$10"}>{message?message.message:'Waiting for messages...'}</H2>
            </AdminPage>)
        },

        getServerSideProps: SSR(async (context) => withSession(context, []))
    }
}