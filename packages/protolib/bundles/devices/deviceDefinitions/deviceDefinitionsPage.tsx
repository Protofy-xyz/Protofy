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
          board: z.union(extraData.boards.map(o => z.literal(o.name))).after('name').display(),
          sdk: z.union([
            z.literal(""),
            z.literal("")
          ]).dependsOn("board").generateOptions((formData) => {
            const { boards, cores, sdks } = extraData
            if (formData.board) {
              const board = boards.find(brd => brd.name === formData.board)
              return cores.find(core => core.name === board.core).sdks
            }
            return []
          }).after("name").display(),
        }}
        model={DeviceDefinitionModel}
        pageState={pageState}
        icons={DeviceDefitionIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
        customFields={{
          'config': {
              component: (path, data, setData, mode) => {
                return <h1>TODO</h1>
              },
              hideLabel: false
          }
      }}
      />
    </AdminPage>)
  },
  getServerSideProps: PaginatedDataSSR('/adminapi/v1/devicedefinitions', ['admin'], {}, async () => {
    const boards = await API.get('/adminapi/v1/deviceboards?itemsPerPage=1000')
    const cores = await API.get('/adminapi/v1/devicecores?itemsPerPage=1000')
    const sdks = await API.get('/adminapi/v1/devicesdks?itemsPerPage=1000')

    return {
      boards: boards.isLoaded ? boards.data.items.map(i => DeviceBoardModel.load(i).getData()) : [],
      cores: cores.isLoaded ? cores.data.items.map(i => DeviceCoreModel.load(i).getData()) : [],
      sdks: sdks.isLoaded ? sdks.data.items.map(i => DeviceCoreModel.load(i).getData()) : []
    }
  })
}