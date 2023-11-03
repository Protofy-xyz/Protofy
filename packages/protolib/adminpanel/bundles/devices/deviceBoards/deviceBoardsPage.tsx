import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { CircuitBoard, Tag, Layers } from '@tamagui/lucide-icons';
import { DeviceBoardModel } from './deviceBoardsSchemas';
import { DataTable2, DataView } from 'protolib'
import { Chip } from 'protolib';

const DeviceBoardIcons = { name: Tag, core: Layers }

export default {
  component: ({ workspace, pageState, sourceUrl, initialItems, itemData, pageSession }: any) => {
    return (<AdminPage title="Device Boards" workspace={workspace} pageSession={pageSession}>
      <DataView
        itemData={itemData}
        rowIcon={CircuitBoard}
        sourceUrl={sourceUrl}
        initialItems={initialItems}
        numColumnsForm={1}
        name="board"
        onAdd={data => { return data }}
        onEdit={data => { return data }}
        columns={DataTable2.columns(
          DataTable2.column("name", "name", true),
          DataTable2.column("core", "core", true, (row) => <Chip text={row.core.name} color={'$gray5'} />),
          DataTable2.column("ports", "ports", true, (row) => <Chip text={row.ports.length} color={'$gray5'} />),
        )}
        model={DeviceBoardModel}
        pageState={pageState}
        icons={DeviceBoardIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
      />
    </AdminPage>)
  },
  getServerSideProps: PaginatedDataSSR('/adminapi/v1/deviceboards')
}