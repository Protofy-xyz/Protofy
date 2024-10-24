import { StateMachineDefinitionModel } from './stateMachineDefinitionSchema'
import { DataTable2 } from '../../../components/DataTable2'
import { DataView } from '../../../components/DataView'
import { AdminPage } from '../../../components/AdminPage'
import { InteractiveIcon } from '../../../components/InteractiveIcon'
import { ExternalLink, Link, FileBox } from '@tamagui/lucide-icons'
import { PaginatedData } from '../../../lib/SSR'


const sourceUrl = '/api/core/v1/statemachinedefinition'
export default {
  component: ({ pageState, initialItems, pageSession }: any) => {
    return (<AdminPage title="State Machine Definitions" pageSession={pageSession}>
      <DataView
        rowIcon={FileBox}
        enableAddToInitialData
        sourceUrl={sourceUrl}
        initialItems={initialItems}
        numColumnsForm={1}
        name="state machine definitions"
        columns={DataTable2.columns(
          DataTable2.column("", () => "", false, (row) => <a href={row.url} target='_blank'>
            <InteractiveIcon Icon={ExternalLink}></InteractiveIcon>
          </a>, true, '50px'),
          DataTable2.column("name", row => row.name, "name", undefined, true, '250px'),
        )}
        model={StateMachineDefinitionModel}
        pageState={pageState}
      />
    </AdminPage>)
  },
  getServerSideProps: PaginatedData(sourceUrl, ['admin'])
}