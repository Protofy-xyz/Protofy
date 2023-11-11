
import {AdminPage} from 'protolib/adminpanel/features/next'
import { SSR } from 'app/conf'
import { withSession } from 'protolib'

export default { 
    'admin/messages': {
        component: ({pageSession}:any) => {
            return (<AdminPage title="Messages" pageSession={pageSession}>
                
            </AdminPage>)
        },

        getServerSideProps: SSR(async (context) => withSession(context, []))
    }
}