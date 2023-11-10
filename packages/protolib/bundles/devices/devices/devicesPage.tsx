import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { BookOpen, Tag, Layers, Router } from '@tamagui/lucide-icons';
import { DevicesModel } from './devicesSchemas';
import { API, Chip, DataTable2, DataView } from 'protolib'
import { z } from 'zod';
import { DeviceDefinitionModel } from '../deviceDefinitions';

const DevicesIcons = { name: Tag, deviceDefinition: BookOpen }

export default {
  component: ({ workspace, pageState, sourceUrl, initialItems, itemData, pageSession, extraData }: any) => {
    return (<AdminPage title="Devices" workspace={workspace} pageSession={pageSession}>
      <DataView
        itemData={itemData}
        rowIcon={Router}
        sourceUrl={sourceUrl}
        initialItems={initialItems}
        numColumnsForm={1}
        name="device"
        onAdd={data => { return data }}
        onEdit={data => { return data }}
        columns={DataTable2.columns(
          DataTable2.column("name", "name", true),
          DataTable2.column("device definition", "deviceDefinition", true),
        )}
        extraFieldsForms={{
          deviceDefinition: z.union(extraData.deviceDefinitions.map(o => z.literal(o))).after('name').display(),
        }}
        model={DevicesModel}
        pageState={pageState}
        icons={DevicesIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
      />
    </AdminPage>)
  },
  getServerSideProps: PaginatedDataSSR('/adminapi/v1/devices', ['admin'], {}, async () => {
    const deviceDefinitions = await API.get('/adminapi/v1/deviceDefinitions?itemsPerPage=1000')
    return {
      deviceDefinitions: deviceDefinitions.isLoaded ? deviceDefinitions.data.items.map(i => DeviceDefinitionModel.load(i).getId()) : []
    }
  })
}