import { CircuitBoard, Tag, Layers } from '@tamagui/lucide-icons';
import { DeviceBoardModel } from './deviceBoardsSchemas';
import { API, z, getPendingResult } from 'protobase';
import { Chip } from '../../../components/Chip';
import { DataTable2 } from '../../../components/DataTable2';
import { DataView } from '../../../components/DataView';
import { AdminPage } from '../../../components/AdminPage';
import { PaginatedDataSSR } from '../../../lib/SSR';
import { usePendingEffect } from '../../../lib/usePendingEffect';
import { DeviceCoreModel } from '../devicecores';
import { useState } from 'react';

const DeviceBoardIcons = { name: Tag, core: Layers }

const sourceUrl = '/api/core/v1/deviceboards'
const coresSourceUrl = '/api/core/v1/devicecores?all=1'

export default {
  component: ({ pageState, initialItems, itemData, pageSession, extraData }: any) => {
    const [cores, setCores] = useState(extraData?.cores ?? getPendingResult('pending'))
    usePendingEffect((s) => { API.get({ url: coresSourceUrl }, s) }, setCores, extraData?.cores)

    return (<AdminPage title="Device Boards" pageSession={pageSession}>
      <DataView
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
          DataTable2.column("name", (row) => row.name, "name"),
          DataTable2.column("core", (row) => row.core, "core", (row) => <Chip text={row.core} color={'$gray5'} />),
          DataTable2.column("ports", (row) => row.ports, "ports", (row) => <Chip text={Object.keys(row.ports).length + ""} color={'$gray5'} />),
        )}
        extraFieldsForms={{
          core: z.union(cores.isLoaded ? cores.data.items.map(i => z.literal(DeviceCoreModel.load(i).getId())) : []).after('name'),
        }}
        model={DeviceBoardModel}
        pageState={pageState}
        icons={DeviceBoardIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
      />
    </AdminPage>)
  },

  getServerSideProps: PaginatedDataSSR(sourceUrl, ['admin'], {}, async () => {
    return {
      cores: await API.get(coresSourceUrl)
    }
  })
}