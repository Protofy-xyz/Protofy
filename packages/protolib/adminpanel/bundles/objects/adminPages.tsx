
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { ObjectModel } from '.'
import {DataView} from 'protolib'

const format = 'YYYY-MM-DD HH:mm:ss'
const ObjectIcons =  {}
const rowsPerPage = 20
export default {
    'admin/objects': {
        component: ({workspace, pageState, sourceUrl, initialItems, pageSession}:any) => {
            return (<AdminPage title="Objects" workspace={workspace} pageSession={pageSession}>
                <DataView
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="object"
                    // hideAdd={true}
                    model={ObjectModel} 
                    pageState={pageState}
                    icons={ObjectIcons}
                />
            </AdminPage>)
        }, 
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/objects')
    }
}