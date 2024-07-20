import { FSMModel } from './FSMSchema'
import { DataTable2 } from '../../components/DataTable2'
import { DataView } from '../../components/DataView'
import { AdminPage } from 'app/layout/AdminPage'
import { InteractiveIcon } from '../../components/InteractiveIcon'
import { ExternalLink, Link } from '@tamagui/lucide-icons'
import { PaginatedData } from '../../lib/SSR'


const sourceUrl = '/adminapi/v1/fsm'
export default {
    'fsm': {
        component: ({ pageState, initialItems, pageSession }: any) => {
            return (<AdminPage title="State Machines" pageSession={pageSession}>
                <DataView
                    rowIcon={Link}
                    enableAddToInitialData
                    sourceUrl={sourceUrl}
                    initialItems={initialItems}
                    numColumnsForm={1}
                    name="state machine"
                    columns={DataTable2.columns(
                        DataTable2.column("", ()=>"", false, (row) => <a href={row.url} target='_blank'>
                            <InteractiveIcon Icon={ExternalLink}></InteractiveIcon>
                        </a>, true, '50px'),
                        DataTable2.column("name", row => row.name, "name", undefined, true, '250px'),
                    )}
                    model={FSMModel}
                    pageState={pageState}
                />
            </AdminPage>)
        },
        getServerSideProps: PaginatedData(sourceUrl, ['admin'])
    }
}