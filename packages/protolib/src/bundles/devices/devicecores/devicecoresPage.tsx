import { Cpu, Layers, Tag } from '@tamagui/lucide-icons';
import { DeviceCoreModel } from './devicecoresSchemas';
import { API, z, getPendingResult } from 'protobase';
import { Chip } from '../../../components/Chip';
import { DataTable2 } from '../../../components/DataTable2';
import { DataView } from '../../../components/DataView';
import { AdminPage } from '../../../components/AdminPage';
import { PaginatedDataSSR } from '../../../lib/SSR';
import { usePendingEffect } from '../../../lib/usePendingEffect';
import { DeviceSdkModel } from '../deviceSdks';
import { useState } from 'react';

const DeviceCoreIcons = { name: Tag, sdk: Layers }
const sourceUrl = '/adminapi/v1/devicecores'
const sdksSourceUrl = '/adminapi/v1/devicesdks?all=1'

export default {
  component: ({ pageState, initialItems, itemData, pageSession, extraData }: any) => {
    const [sdks, setSdks] = useState(extraData?.sdks ?? getPendingResult('pending'))
    usePendingEffect((s) => { API.get({ url: sdksSourceUrl }, s) }, setSdks, extraData?.cores)
    
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
          DataTable2.column("name", (row) => row.name, "name"),
          DataTable2.column("sdk", (row) => row.sdk, "sdk", row => <div
            style={{ gap: '5px', display: 'flex', flexDirection: 'row' }}
          >
            {
              row.sdks?.map(sdk => <Chip text={sdk} color={'$gray5'} />)
            }
          </div>),
        )
        }
        extraFieldsForms={{
          sdks: z.array(z.union([z.literal(""), z.literal("")])).generateOptions(() => sdks.isLoaded ? sdks.data.items.map(i => DeviceSdkModel.load(i).getData()).map(o => o.name) : []).after('name').display(),
        }}
        model={DeviceCoreModel}
        pageState={pageState}
        icons={DeviceCoreIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
      />
    </AdminPage >)
  },
  getServerSideProps: PaginatedDataSSR(sourceUrl, ['admin'], {}, async () => {
    return {
      sdks: await API.get(sdksSourceUrl)
    }
  })
}