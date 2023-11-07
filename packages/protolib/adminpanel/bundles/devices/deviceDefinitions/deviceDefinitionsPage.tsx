import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { CircuitBoard, Tag, Settings, BookOpen } from '@tamagui/lucide-icons';
import { DeviceDefinitionModel } from './deviceDefinitionsSchemas';
import { API, Chip, DataTable2, DataView } from 'protolib'
import { z } from 'zod';
import { DeviceBoardModel } from '../deviceBoards';
import { DeviceCoreModel } from '../devicecores';

const DeviceDefitionIcons = {
  name: Tag,
  board: CircuitBoard
}

export default {
  component: ({ workspace, pageState, sourceUrl, initialItems, itemData, pageSession, extraData }: any) => {
    return (<AdminPage title="Device Definitions" workspace={workspace} pageSession={pageSession}>
      <DataView
        itemData={itemData}
        rowIcon={BookOpen}
        sourceUrl={sourceUrl}
        initialItems={initialItems}
        numColumnsForm={1}
        name="Definition"
        onAdd={data => { return data }}
        onEdit={data => { return data }}
        columns={DataTable2.columns(
          DataTable2.column("name", "name", true),
          DataTable2.column("board", "board", true, (row) => <Chip text={row.board} color={'$gray5'} />),
          DataTable2.column("sdk", "sdk", true, (row) => <Chip text={row.sdk} color={'$gray5'} />),
        )}
        extraFieldsForms={{
          board: z.union(extraData.boards.map(o => z.literal(o))).after('name').display(),
          sdk: z.union(extraData.cores.map(o => z.literal(JSON.stringify(o)))).dependsOn("board").after("name").display(),
        }}
        model={DeviceDefinitionModel}
        pageState={pageState}
        icons={DeviceDefitionIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
      />
    </AdminPage>)
  },
  getServerSideProps: PaginatedDataSSR('/adminapi/v1/devicedefinitions', ['admin'], {}, async () => {
    const boards = await API.get('/adminapi/v1/deviceboards?itemsPerPage=1000')
    const cores = await API.get('/adminapi/v1/devicecores?itemsPerPage=1000')

    return {
      boards: boards.isLoaded ? boards.data.items.map(i => DeviceBoardModel.load(i).getId()) : [],
      cores: cores.isLoaded ? cores.data.items.map(i => DeviceCoreModel.load(i).getData()) : []
    }
  })
}