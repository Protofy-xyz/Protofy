import React, { useState } from "react";
import { CircuitBoard, Tag, BookOpen, Eye } from '@tamagui/lucide-icons';
import { DeviceDefinitionModel } from './deviceDefinitionsSchemas';
import { API, Chip, DataTable2, DataView, ButtonSimple, AlertDialog, AdminPage, PaginatedData, InteractiveIcon } from 'protolib'
import { z } from 'protolib/base'
import { DeviceBoardModel } from '../deviceBoards';
import { DeviceCoreModel } from '../devicecores';
import { Button, XStack } from "tamagui";
import { useThemeSetting } from '@tamagui/next-theme'
import { getPendingResult } from "protolib/base";
import { usePendingEffect, useWorkspaceEnv } from "protolib";
import { Flows } from "protolib";
import { getFlowMasks, getFlowsCustomComponents } from "app/bundles/masks";
import { useRouter } from 'next/router'
import layout from './DeviceLayout'

const DeviceDefitionIcons = {
  name: Tag,
  board: CircuitBoard
}

const sourceUrl = '/adminapi/v1/devicedefinitions'
const coresSourceUrl = '/adminapi/v1/devicecores?all=1'

export default {
  component: ({ workspace, pageState, initialItems, itemData, pageSession, extraData }: any) => {
    const [showDialog, setShowDialog] = React.useState(false)
    const { resolvedTheme } = useThemeSetting();
    const defaultJsCode = { "components": "[\n \"mydevice\",\n \"esp32dev\",\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n];\n\n" }
    const [sourceCode, setSourceCode] = useState(defaultJsCode.components)
    const [editedObjectData, setEditedObjectData] = React.useState<any>({})
    const router = useRouter()
    const env = useWorkspaceEnv()

    const [coresList, setCoresList] = useState(extraData?.cores ?? getPendingResult('pending'))
    usePendingEffect((s) => { API.get({ url: coresSourceUrl }, s) }, setCoresList, extraData?.cores)
    const cores = coresList.isLoaded ? coresList.data.items.map(i => DeviceCoreModel.load(i).getData()) : []

    return (<AdminPage title="Device Definitions" workspace={workspace} pageSession={pageSession}>
      <AlertDialog open={showDialog} setOpen={(open) => { setShowDialog(open) }} hideAccept={true} style={{ width: "80%", height: "80%", padding: '0px', overflow: 'hidden' }}>
        <XStack f={1} minWidth={"100%"}>
          <Flows
            style={{ width: "100%" }}
            disableDots={false}
            hideBaseComponents={true}
            disableStart={true}
            autoFitView={true}
            getFirstNode={(nodes) => {
              return nodes.find(n => n.type == 'ArrayLiteralExpression')
            }}
            showActionsBar={false}
            layout={layout}
            customComponents={getFlowsCustomComponents(router.pathname, router.query)}
            bridgeNode={false}
            setSourceCode={(sourceCode) => {
              console.log('set new sourcecode from flows: ', sourceCode)
              setSourceCode(sourceCode)
            }}
            sourceCode={sourceCode}
            themeMode={resolvedTheme}
            key={'flow'}
            config={{ masks: getFlowMasks(router.pathname, router.query), layers: [] }}
            bgColor={'transparent'}
            dataNotify={(data: any) => {
              if (data.notifyId) {
                //mqttPub('datanotify/' + data.notifyId, JSON.stringify(data))
              }
            }}
            onEdit={(code) => editedObjectData.setData({ components: code })}
            positions={[]}
            disableSideBar={true}
            // store={uiStore}
            display={true}
            flowId={"flows-editor"}
          />
        </XStack>
      </AlertDialog>

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
          DataTable2.column("", () => "", false, (row) => <InteractiveIcon onPress={async (e) => {
            setShowDialog(true)
            setSourceCode(row.config.components)
          }} Icon={Eye}></InteractiveIcon>, true, '50px'),
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
          }).after("name"),
        }}
        extraFieldsFormsAdd={{
          device: z.boolean().after("config").label("automatic device").defaultValue(true)
        }}
        model={DeviceDefinitionModel}
        pageState={pageState}
        icons={DeviceDefitionIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
        customFields={{
          'config': {
            component: (path, data, setData, mode) => {
              if (mode == "preview") { return <></> }
              return <Button
                style={{ width: "100%" }}
                onPress={(e) => {
                  setShowDialog(true)
                  if (mode == "add") {
                    setSourceCode(defaultJsCode.components)
                  } else {
                    setSourceCode(data.components)
                  }
                  setEditedObjectData({ path, data, setData, mode })
                }}>Edit</Button>
            },
            hideLabel: false
          }
        }}
      />
    </AdminPage>)
  },
  getServerSideProps: PaginatedData(sourceUrl, ['admin'], {
    cores: coresSourceUrl
  })
}