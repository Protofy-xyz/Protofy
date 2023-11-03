import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { Cpu, Layers, Tag } from '@tamagui/lucide-icons';
import { DeviceCoreModel } from './devicecoresSchemas';
import { Chip, DataTable2, DataView } from 'protolib'

const DeviceCoreIcons = { name: Tag, sdk: Layers }
export default {
  component: ({ workspace, pageState, sourceUrl, initialItems, itemData, pageSession }: any) => {
    return (<AdminPage title="Device Cores" workspace={workspace} pageSession={pageSession}>
      <DataView
        itemData={itemData}
        rowIcon={Cpu}
        sourceUrl={sourceUrl}
        initialItems={initialItems}
        numColumnsForm={1}
        name="core"
        onAdd={data => { return data }}
        onEdit={data => { return data }}
        columns={DataTable2.columns(
          DataTable2.column("name", "name", true),
          DataTable2.column("sdk", "sdk", true, row => <div
            style={{ gap: '5px', display: 'flex', flexDirection: 'row' }}
          >
            {
              row.sdks?.map(sdk => <Chip text={sdk} color={'$gray5'} />)
            }
          </div>),
        )
        }
        model={DeviceCoreModel}
        pageState={pageState}
        icons={DeviceCoreIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
      />
    </AdminPage >)
  },
  getServerSideProps: PaginatedDataSSR('/adminapi/v1/devicecores')
}