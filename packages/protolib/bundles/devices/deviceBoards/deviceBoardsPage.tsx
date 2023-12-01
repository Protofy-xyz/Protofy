import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { CircuitBoard, Tag, Layers } from '@tamagui/lucide-icons';
import { DeviceBoardModel } from './deviceBoardsSchemas';
import { API, Chip, DataTable2, DataView } from 'protolib'
import { z } from 'protolib/base'
import { DeviceCoreModel } from '../devicecores';

const DeviceBoardIcons = { name: Tag, core: Layers }

export default {
  component: ({ pageState, sourceUrl, initialItems, itemData, pageSession, extraData }: any) => {
    return (<AdminPage title="Device Boards" pageSession={pageSession}>
      <DataView
        integratedChat
        entityName={"deviceboards"}
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
          DataTable2.column("core", "core", true, (row) => <Chip text={row.core} color={'$gray5'} />),
          DataTable2.column("ports", "ports", true, (row) => <Chip text={Object.keys(row.ports).length} color={'$gray5'} />),
        )}
        extraFieldsForms={{
          core: z.union(extraData.cores.map(o => z.literal(o))).after('name'),
        }}
        model={DeviceBoardModel}
        pageState={pageState}
        icons={DeviceBoardIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
      />
    </AdminPage>)
  },
  getServerSideProps: PaginatedDataSSR('/adminapi/v1/deviceboards', ['admin'], {}, async () => {
    const cores = await API.get('/adminapi/v1/devicecores?itemsPerPage=1000')

    return {
      cores: cores.isLoaded ? cores.data.items.map(i => DeviceCoreModel.load(i).getId()) : []
    }
  })
}