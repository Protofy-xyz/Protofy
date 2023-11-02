
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { PageModel } from '.'
import {DataView} from 'protolib'

const format = 'YYYY-MM-DD HH:mm:ss'
const PageIcons =  {}
const rowsPerPage = 20
export default {
    'admin/pages': {
        component: ({workspace, pageState, sourceUrl, initialItems, pageSession}:any) => {
            return (<AdminPage title="Pages" workspace={workspace} pageSession={pageSession}>
                <DataView
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="page"
                    // hideAdd={true}
                    model={PageModel} 
                    pageState={pageState}
                    icons={PageIcons}
                />
            </AdminPage>)
        }, 
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/pages')
    }
}