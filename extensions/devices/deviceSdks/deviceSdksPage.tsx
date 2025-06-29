import { Layers, Tag, Code } from '@tamagui/lucide-icons';
import { DeviceSdkModel } from './deviceSdksSchema';
import { PaginatedDataSSR } from 'protolib/lib/SSR'
import { DataTable2 } from 'protolib/components/DataTable2'
import { DataView } from 'protolib/components/DataView'
import { AdminPage } from 'protolib/components/AdminPage'

const DeviceSdkIcons = { name: Tag, sdk: Layers }
const sourceUrl = '/api/core/v1/devicesdks'
export default {
  component: ({ pageState, initialItems, itemData, pageSession }: any) => {
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
          DataTable2.column("id", (row) => row.id, "id"),
          DataTable2.column("name", (row) => row.name, "name"),
        )}
        model={DeviceSdkModel}
        pageState={pageState}
        icons={DeviceSdkIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
      />
    </AdminPage >)
  },
  getServerSideProps: PaginatedDataSSR(sourceUrl, ['admin'])
}