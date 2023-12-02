
import {AdminPage, PaginatedDataSSR} from 'protolib/adminpanel/features/next'
import { ObjectModel } from '.'
import {DataView, DataTable2, Chip, API} from 'protolib'
import { Pencil, Box } from '@tamagui/lucide-icons';
import { usePageParams } from '../../next';

const format = 'YYYY-MM-DD HH:mm:ss'
const ObjectIcons =  {}
const rowsPerPage = 20
export default {
    'admin/objects': {
        component: ({pageState, sourceUrl, initialItems, pageSession}:any) => {
            const {replace} = usePageParams(pageState)

            return (<AdminPage title="Objects" pageSession={pageSession}>
                <DataView
                    integratedChat
                    rowIcon={Box}
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="object"
                    columns={DataTable2.columns(
                        DataTable2.column("name", "name", true),
                        DataTable2.column("features", "features", true, row => Object.keys(row.features).map(f => <Chip text={f} color={'$gray5'} />)),
                    )}
                    // hideAdd={true}
                    model={ObjectModel} 
                    pageState={pageState}
                    icons={ObjectIcons}
                    extraMenuActions = {[
                        {
                            text:"Edit Object file", 
                            icon:Pencil, 
                            action: (element) => { replace('editFile', element.getDefaultSchemaFilePath()) },
                            isVisible: (data)=>true
                        }
                    ]}
                />
            </AdminPage>)
        }, 
        getServerSideProps: PaginatedDataSSR('/adminapi/v1/objects', ['admin'], {
            orderBy: 'name'
        })
    }
}