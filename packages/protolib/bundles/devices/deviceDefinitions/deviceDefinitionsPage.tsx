import React, { useState, useEffect, useRef } from "react";
import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { CircuitBoard, Tag, Settings, BookOpen } from '@tamagui/lucide-icons';
import { DeviceDefinitionModel } from './deviceDefinitionsSchemas';
import { API, Chip, DataTable2, DataView, ButtonSimple, AlertDialog, Center } from 'protolib'
import { z } from 'protolib/base'
import { DeviceBoardModel } from '../deviceBoards';
import { DeviceCoreModel } from '../devicecores';
import { Paragraph, Spinner, XStack } from "tamagui";
import dynamic from 'next/dynamic'
import { useThemeSetting } from '@tamagui/next-theme'

const DeviceDefitionIcons = {
  name: Tag,
  board: CircuitBoard
}


const FlowsWidget = dynamic(() => import('../../../adminpanel/features/components/FlowsWidget'), {
  loading: () => <>
    <Center>
      <Spinner size={'small'} scale={3} top={-50} />
      Loading
    </Center>
  </>,
  ssr: false
})

export default {
  component: ({ workspace, pageState, sourceUrl, initialItems, itemData, pageSession, extraData }: any) => {
    const [showDialog, setShowDialog] = React.useState(false)
    const [isSaveActive, setIsSaveActive] = React.useState(false);
    const { resolvedTheme } = useThemeSetting();
    const defaultJsCode = { "components": "[\n \"mydevice\",\n \"esp32dev\",\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n null,\n];\n\n" }
    const [sourceCode, setSourceCode] = useState(defaultJsCode.components)
    // const [isModified,setIsModified] = React.useState(false)
    const [editedObjectData, setEditedObjectData]= React.useState({})

    const saveToFile= (code,path)=>{
      editedObjectData.setData({components: code, sdkConfig: {board: "esp32dev", framework:{type: "arduino"}}})
    }

    return (<AdminPage title="Device Definitions" workspace={workspace} pageSession={pageSession}>
      <AlertDialog open={showDialog} setOpen={(open) => { setShowDialog(open) }} hideAccept={true} style={{ width: "80%", height: "80%" }}>
        {/* <Center style={{minWidth: "80%" }}> */}
        <XStack mt={10} f={1} minWidth={"100%"}>
          <FlowsWidget style={{ width: "100%" }}
            // icons={<XStack position="absolute" right={isFull ? 0 : 50} top={isFull ? -35 : -32}>
            //     <IconContainer onPress={() => { }}>
            //         {/* <SizableText mr={"$2"}>Save</SizableText> */}
            //         <Save color="var(--color)" size={isFull ? "$2" : "$1"} />
            //     </IconContainer>
            // </XStack>}
            // isModified={isModified}
            // setIsModified={(e)=>{console.log("Set is Modified: ", e);}}
            //onPlay={onPlay}
            disableDots={true}
            onSave={isSaveActive?(o) => { 
              console.log("ON SAVE: ", o); 
              saveToFile(o,"a")
           }:null}
            hideBaseComponents={true}
            disableStart={true}
            getFirstNode={(nodes) => {
              return nodes.find(n => n.type == 'ArrayLiteralExpression')
            }}
            showActionsBar={isSaveActive}
            mode={"device"}
            bridgeNode={false}
            setSourceCode={(sourceCode) => {
                console.log('set new sourcecode from flows: ', sourceCode)
                setSourceCode(sourceCode)
            }} 
            sourceCode={sourceCode} themeMode={resolvedTheme} />
          {/* </Center> */}
        </XStack>
      </AlertDialog>

      <DataView
        integratedChat
        entityName={"devicedefinitions"}
        itemData={itemData}
        rowIcon={BookOpen}
        sourceUrl={sourceUrl}
        initialItems={initialItems}
        numColumnsForm={1}
        name="Definition"
        onAdd={data => { console.log("DATA (onAdd): ", data); return data }}
        onEdit={data => { console.log("DATA (onEdit): ", data); return data }}
        columns={DataTable2.columns(
          DataTable2.column("name", "name", true),
          DataTable2.column("board", "board", true, (row) => <Chip text={row.board} color={'$gray5'} />),
          DataTable2.column("sdk", "sdk", true, (row) => <Chip text={row.sdk} color={'$gray5'} />),
          DataTable2.column("config", "config", false, (row) => <ButtonSimple onPress={async (e) => { console.log("row from Edit: ", row); setIsSaveActive(false); setShowDialog(true); setSourceCode(row.config.components); }}>View</ButtonSimple>)
        )}
        extraFieldsForms={{
          board: z.union(extraData.boards.map(o => z.literal(o.name))).after('name').display(),
          sdk: z.union([
            z.literal("hola"),
            z.literal("adios")
          ]).dependsOn("board").generateOptions((formData) => {
            const { boards, cores } = extraData
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
              console.log("inputs: ", { path, data, setData, mode })
              if (mode == "preview"){return <></>}
              return <ButtonSimple onPress={(e) => {setShowDialog(true); setIsSaveActive(true); mode=="add"?setSourceCode(defaultJsCode.components):setSourceCode(data.components); setEditedObjectData({path,data,setData,mode});  console.log("inputs: ", { path, data, setData, mode })}}>Edit</ButtonSimple>
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