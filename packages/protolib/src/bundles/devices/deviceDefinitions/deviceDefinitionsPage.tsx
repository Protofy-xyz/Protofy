import React, { useState } from "react"
import { CircuitBoard, Tag, BookOpen, Eye, Text } from '@tamagui/lucide-icons'
import { DeviceDefinitionModel } from './deviceDefinitionsSchemas'
import { API, z, getPendingResult } from 'protobase'
import { DeviceCoreModel } from '../devicecores'
import { DeviceBoardModel } from "../deviceBoards"
import { usePendingEffect } from "../../../lib/usePendingEffect"
import { Chip } from "../../../components/Chip"
import { DataTable2 } from "../../../components/DataTable2"
import { DataView } from "../../../components/DataView"
import { AdminPage } from "../../../components/AdminPage"
import { PaginatedData } from "../../../lib/SSR"
import { useSearchParams, usePathname } from 'solito/navigation'
import { ConfigComponent } from "./ConfigComponent"
import { Input } from 'tamagui'

const DeviceDefitionIcons = {
  name: Tag,
  board: CircuitBoard
}

const sourceUrl = '/api/core/v1/devicedefinitions'
const boardsSourceUrl = '/api/core/v1/deviceboards'
const coresSourceUrl = '/api/core/v1/devicecores?all=1'

export default {
  component: ({ workspace, pageState, initialItems, itemData, pageSession, extraData }: any) => {


    const [coresList, setCoresList] = useState(extraData?.cores ?? getPendingResult('pending'))
    usePendingEffect((s) => { API.get({ url: coresSourceUrl }, s) }, setCoresList, extraData?.cores)
    const cores = coresList.isLoaded ? coresList.data.items.map(i => DeviceCoreModel.load(i).getData()) : []

    const [boardsList, setBoardsList] = useState(extraData?.boards ?? getPendingResult('pending'))
    usePendingEffect((s) => { API.get({ url: boardsSourceUrl }, s) }, setBoardsList, extraData?.boards)
    const boards = boardsList.isLoaded ? boardsList.data.items.map(i => DeviceBoardModel.load(i).getData()) : []

    const renderConfigButton = (path, data, setData, mode, originalData) => {
      return (
        <ConfigComponent
          path={path}
          data={data}
          setData={setData}
          mode={mode}
          originalData={originalData}
          cores={cores}
          boards={boards}
        />
      );
    };

    return (<AdminPage title="Device Definitions" workspace={workspace} pageSession={pageSession}>
      <DataView
        entityName={"device definitions"}
        itemData={itemData}
        rowIcon={BookOpen}
        sourceUrl={sourceUrl}
        initialItems={initialItems}
        numColumnsForm={1}
        name="Definition"
        onEdit={data => { console.log("DATA (onEdit): ", data); return data }}
        columns={DataTable2.columns(
          DataTable2.column("name", row => row.name, "name"),
          DataTable2.column("board", row => row.board, "board", (row) => <Chip text={row.board.name} color={'$gray5'} />),
          DataTable2.column("sdk", row => row.sdk, "sdk", (row) => <Chip text={row.sdk} color={'$gray5'} />),
        )}
        extraFieldsForms={{
          sdk: z.union([z.any(), z.any()]).dependsOn("board").generateOptions((formData) => {
            if (formData.board) {
              return cores.find(core => core.name === formData.board.core).sdks
            }
            return []
          }).after("board"),
        }}
        extraFieldsFormsAdd={{
          device: z.boolean().after("config").label("automatic device").defaultValue(true)
        }}
        model={DeviceDefinitionModel}
        pageState={pageState}
        icons={DeviceDefitionIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
        customFields={{
          config: {
            component: (path, data, setData, mode, originalData) => {
              if(originalData.sdk == undefined){
                return <Input
                          focusStyle={{ outlineWidth: 1 }}
                          disabled={true}
                          f={1}
                          placeholder={'Fill sdk property first'}
                          bc="$backgroundTransparent"
                      ></Input>
              }
              else {
                return renderConfigButton(path, data, setData, mode, originalData);
              }
            },
            hideLabel: false
          }
        }}
      />
    </AdminPage>)
  },
  getServerSideProps: PaginatedData(sourceUrl, ['admin'], {
    cores: coresSourceUrl,
    boards: boardsSourceUrl
  })
}