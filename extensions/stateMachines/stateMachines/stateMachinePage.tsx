import { StateMachineModel } from './stateMachineSchema'
import { DataTable2 } from '../../../components/DataTable2'
import { DataView } from '../../../components/DataView'
import { AdminPage } from '../../../components/AdminPage'
import { InteractiveIcon } from '../../../components/InteractiveIcon'
import { ExternalLink, Link, FileBox } from '@tamagui/lucide-icons'
import { PaginatedDataSSR } from '../../../lib/SSR'
import { JSONViewer } from '../../../components/jsonui'
import { Chip } from '../../../components/Chip'


const sourceUrl = '/api/v1/statemachines'
export default {
  component: ({ pageState, initialItems, pageSession, extraData }: any) => {
    return (<AdminPage title="State Machines" pageSession={pageSession}>
      <DataView
        rowIcon={FileBox}
        enableAddToInitialData
        sourceUrl={sourceUrl}
        initialItems={initialItems}
        numColumnsForm={1}
        name="state machines"
        columns={DataTable2.columns(
          DataTable2.column("name", row => row.name, "name", undefined, true, '250px'),
          DataTable2.column("running", row => row.running, "running", (row) => <Chip key={row.rowId} text={row.running ? 'true' : 'false'} color={row.running ? '$color6' : '$gray5'} />, true, '180px'),
          DataTable2.column("state", row => row.state, "state", (row) => <Chip key={row.rowId} text={row.state} color={row.state === 'none' ? '$gray5' : '$color6'} />, true, '180px'),
          DataTable2.column("context", row => row.context, false, (row) => <JSONViewer
            onChange={() => { }}
            editable={false}
            data={row.context}
            collapsible
            compact={false}
            defaultCollapsed={true}
          />),
        )}
        model={StateMachineModel}
        pageState={pageState}
      />
    </AdminPage>)
  },
  getServerSideProps: PaginatedDataSSR(sourceUrl, ['admin'])
}

