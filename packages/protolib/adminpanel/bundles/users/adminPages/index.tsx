import ListUsers from '../components/ListUsers'
import {AdminPage, SSR} from 'protolib/adminpanel/features/next'

export default {
    'admin/users': {
        component: ({workspace, initialItems, pageSession}:any) => {
            return (<AdminPage workspace={workspace} pageSession={pageSession}>
                <ListUsers sourceUrl="/adminapi/v1/accounts" initialItems={initialItems}/>
            </AdminPage>)
        }, 
        getServerSideProps: SSR('/adminapi/v1/accounts')
    }
}