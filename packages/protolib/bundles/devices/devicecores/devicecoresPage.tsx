import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { Cpu, Layers, Tag } from '@tamagui/lucide-icons';
import { DeviceCoreModel } from './devicecoresSchemas';
import { z } from 'protolib/base'
import { API, Chip, DataTable2, DataView } from 'protolib'
import { DeviceSdkModel } from '../deviceSdks';

const DeviceCoreIcons = { name: Tag, sdk: Layers }
export default {
  component: ({ pageState, sourceUrl, initialItems, itemData, pageSession, extraData }: any) => {
    return (<AdminPage title="Device Cores" pageSession={pageSession}>
      <DataView
        integratedChat
        itemData={itemData}
        rowIcon={Cpu}
        sourceUrl={sourceUrl}
        initialItems={initialItems}
        numColumnsForm={1}
        entityName={"devicecores"}
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
        extraFieldsForms={{
          sdks: z.array(z.union([z.literal(""), z.literal("")])).generateOptions(() => extraData.sdks.map(o => o.name)).after('name'),
        }}
        model={DeviceCoreModel}
        pageState={pageState}
        icons={DeviceCoreIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
      />
    </AdminPage >)
  },
  getServerSideProps: PaginatedDataSSR('/adminapi/v1/devicecores', ['admin'], {}, async () => {
    const sdks = await API.get('/adminapi/v1/devicesdks?itemsPerPage=1000')

    return {
      sdks: sdks.isLoaded ? sdks.data.items.map(i => DeviceSdkModel.load(i).getData()) : []
    }
  })
}