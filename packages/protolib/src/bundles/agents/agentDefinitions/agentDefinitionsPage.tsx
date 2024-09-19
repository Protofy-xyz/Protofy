import React, { useContext, useState } from "react"
import { CircuitBoard, Tag, BookOpen, Eye } from '@tamagui/lucide-icons'
import { AgentDefinitionModel } from './agentDefinitionsSchemas'
import { API, z, getPendingResult } from 'protobase'
import { DeviceCoreModel } from '../devicecores'
import { useThemeSetting } from '@tamagui/next-theme'
import { usePendingEffect } from "../../../lib/usePendingEffect"
import { useWorkspaceEnv } from "../../../lib/useWorkspaceEnv"
import { Chip } from "../../../components/Chip"
import { DataTable2 } from "../../../components/DataTable2"
import { DataView } from "../../../components/DataView"
import { AdminPage } from "../../../components/AdminPage"
import { PaginatedData } from "../../../lib/SSR"
import { useSearchParams, usePathname } from 'solito/navigation'
import { AppConfContext, SiteConfigType } from "../../../providers/AppConf"

const AgentDefitionIcons = {
  name: Tag,
  board: CircuitBoard
}

const sourceUrl = '/adminapi/v1/agentdefinitions'
const coresSourceUrl = '/adminapi/v1/devicecores?all=1'

export default {
  component: ({ workspace, pageState, initialItems, itemData, pageSession, extraData }: any) => {
    const { resolvedTheme } = useThemeSetting();
    const env = useWorkspaceEnv()
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const SiteConfig = useContext<SiteConfigType>(AppConfContext);

    const query = Object.fromEntries(searchParams.entries());

    const [coresList, setCoresList] = useState(extraData?.cores ?? getPendingResult('pending'))
    usePendingEffect((s) => { API.get({ url: coresSourceUrl }, s) }, setCoresList, extraData?.cores)
    const cores = coresList.isLoaded ? coresList.data.items.map(i => DeviceCoreModel.load(i).getData()) : []

    return (<AdminPage title="Agent Definitions" workspace={workspace} pageSession={pageSession}>
      <DataView
        entityName={"device definitions"}
        itemData={itemData}
        rowIcon={BookOpen}
        sourceUrl={sourceUrl}
        initialItems={initialItems}
        numColumnsForm={1}
        name="Definition"
        onAdd={data => {
          return { ...data, environment: env }
        }}
        onEdit={data => { console.log("DATA (onEdit): ", data); return data }}
        columns={DataTable2.columns(
          DataTable2.column("name", row => row.name, "name"),
          DataTable2.column("platform", row => row.sdk, "sdk", (row) => <Chip text={row.sdk} color={'$gray5'} />),
        )}
        extraFieldsForms={{
          sdk: z.union([z.any(), z.any()]).dependsOn("board").generateOptions((formData) => {
            if (formData.board) {
              return cores.find(core => core.name === formData.board.core).sdks
            }
            return []
          }).after("board"),
        }}
        // extraFieldsFormsAdd={{
        //   device: z.boolean().after("config").label("automatic device").defaultValue(true)
        // }}
        model={AgentDefinitionModel}
        pageState={pageState}
        icons={AgentDefitionIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
      />
    </AdminPage>)
  },
  getServerSideProps: PaginatedData(sourceUrl, ['admin'], {
    cores: coresSourceUrl
  })
}