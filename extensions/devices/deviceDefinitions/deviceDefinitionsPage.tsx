import React, { useState } from "react"
import { CircuitBoard, Tag, BookOpen, Router, Cog } from '@tamagui/lucide-icons'
import { DeviceDefinitionModel } from './deviceDefinitionsSchemas'
import { API, z, getPendingResult } from 'protobase'
import { DeviceCoreModel } from '../devicecores'
import { DeviceBoardModel } from "../deviceBoards"
import { usePendingEffect } from "protolib/lib/usePendingEffect"
import { Chip } from "protolib/components/Chip"
import { DataTable2 } from "protolib/components/DataTable2"
import { DataView } from "protolib/components/DataView"
import { AdminPage } from "protolib/components/AdminPage"
import { PaginatedData } from "protolib/lib/SSR"
import { ConfigComponent } from "./ConfigComponent" //TODO: Delete this file when WLED case integrated on ConfigEditor
import { ConfigEditor } from "./ConfigEditor"
import { Button, Input, XStack } from '@my/ui'
import { Tinted } from "protolib/components/Tinted"
import { usePageParams } from "protolib/next"
import { InteractiveIcon } from "protolib/components/InteractiveIcon"

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
    const [selectedDefinition, setSelectedDefinition] = useState(null)
    usePendingEffect((s) => { API.get({ url: coresSourceUrl }, s) }, setCoresList, extraData?.cores)
    const cores = coresList.isLoaded ? coresList.data.items.map(i => DeviceCoreModel.load(i).getData()) : []
    const { replace } = usePageParams(pageState)

    const [boardsList, setBoardsList] = useState(extraData?.boards ?? getPendingResult('pending'))
    usePendingEffect((s) => { API.get({ url: boardsSourceUrl }, s) }, setBoardsList, extraData?.boards)
    const boards = boardsList.isLoaded ? boardsList.data.items.map(i => DeviceBoardModel.load(i).getData()) : []

    const generateBoardJs = (boardName) => {
      const board = boards.find((board) => board.name === boardName)
      if (!board) {
        console.error('Board not found')
        return null
      }
      const components = ['mydevice', boardName]
      board.ports.forEach(() => {
        components.push(null)
      })
      return { components: JSON.stringify(components) + ';' }
    }

    return (<AdminPage title="Device Definitions" workspace={workspace} pageSession={pageSession}>
      {!selectedDefinition
        ? <DataView
          entityName={"device definitions"}
          itemData={itemData}
          rowIcon={BookOpen}
          sourceUrl={sourceUrl}
          initialItems={initialItems}
          onSelectItem={(item) => {
            setSelectedDefinition(item)
          }}
          onAdd={(item) => {
            const generatedComponents = generateBoardJs(item.board.name)
            if (generatedComponents) {
              item.config = { components: generatedComponents.components }
            }
            const definitionModel = new DeviceDefinitionModel(item)
            setSelectedDefinition(definitionModel)
            return item
          }}
          numColumnsForm={1}
          name="Definition"
          onEdit={data => { console.log("DATA (onEdit): ", data); return data }}
          columns={DataTable2.columns(
            DataTable2.column("", () => "", false, (row) => {
              return <InteractiveIcon onPress={() => replace('item', row.name)} Icon={Cog}></InteractiveIcon>
            }, true, '50px'),
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
            device: z.boolean().after("board").label("automatic device").defaultValue(true)
          }}
          model={DeviceDefinitionModel}
          pageState={pageState}
          icons={DeviceDefitionIcons}
          toolBarContent={
            <XStack f={1} mr="$2" jc="flex-end">
              <Tinted>
                <Button icon={Router} mah="30px" onPress={() => document.location.href = '/workspace/devices'} >
                  Devices
                </Button>
              </Tinted>
            </XStack>
          }
          dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
        />
        : <ConfigEditor
          onSave={async (data) => {
            await API.post(`/api/core/v1/devicedefinitions/${selectedDefinition.getId()}`, data)
            setSelectedDefinition(null)
          }}
          onCancel={() => setSelectedDefinition(null)}
          definition={selectedDefinition?.data}
        />
      }
    </AdminPage>
    )
  },
  getServerSideProps: PaginatedData(sourceUrl, ['admin'], {
    cores: coresSourceUrl,
    boards: boardsSourceUrl
  })
}