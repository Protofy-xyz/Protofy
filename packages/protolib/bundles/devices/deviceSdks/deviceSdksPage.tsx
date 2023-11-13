import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { Cpu, Layers, Tag, Code } from '@tamagui/lucide-icons';
import { DeviceSdkModel } from './deviceSdksSchema';
import { Chip, DataTable2, DataView } from 'protolib'

const DeviceSdkIcons = { name: Tag, sdk: Layers }
export default {
  component: ({ pageState, sourceUrl, initialItems, itemData, pageSession }: any) => {
    return (<AdminPage title="Device Sdks" pageSession={pageSession}>
      <DataView
        entityName={"devicesdks"}
        itemData={itemData}
        rowIcon={Code}
        sourceUrl={sourceUrl}
        initialItems={initialItems}
        numColumnsForm={1}
        name="Sdk"
        onAdd={data => { return data }}
        onEdit={data => { return data }}
        columns={DataTable2.columns(
          DataTable2.column("id", "id", true),
          DataTable2.column("name", "name", true),
        )}
        model={DeviceSdkModel}
        pageState={pageState}
        icons={DeviceSdkIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
      />
    </AdminPage >)
  },
  getServerSideProps: PaginatedDataSSR('/adminapi/v1/devicesdks')
}