import React, { useEffect } from "react";
import { AdminPage } from "../../components/AdminPage"
import { useRouter } from 'solito/navigation';
import { DataView, DataViewActionButton } from "../../components/DataView"
import { PaginatedData, SSR } from "../../lib/SSR"
import { withSession } from "../../lib/Session"
import { API } from 'protobase'
import { ArduinosModel } from "./arduinosSchemas";
import { DataTable2 } from "../../components/DataTable2"
import { YStack, Text, XStack, ScrollView, Spacer, Button } from "@my/ui";
import { useState } from 'react'
import { BookOpen } from '@tamagui/lucide-icons'
import { AlertDialog } from "../../components/AlertDialog"
import {Slides} from "../../components/Slides"
import { useSubscription } from "protolib/lib/mqtt";



const sourceUrl = '/api/core/v1/arduinos'
const eventsPath = 'notifications/event/create/arduinos/#'
const apiUrl = '/api/core/v1/arduinos'

const ArduinoPreview = ({ element, width, onDelete, onPress, ...props }: any)=>{
  console.log("ArduinoPreview: ", element)
  return (
    <YStack><Text>{`Name: ${element.name}`}</Text></YStack>
  )
}

const EventsSubscription = ({...props})=>{
  const message = useSubscription(eventsPath, { qos: 1 })
  React.useEffect(() => {
    if(message?.message) {
      // console.log("message received: ",message?.message)
      const topic = message.message?.topic
      if(topic.includes(props?.deviceId)){
        if(topic.includes("connected")){
          props.setIsConnected(true)
        }
        if(topic.includes("disconnected")){
          props.setIsConnected(false)
        }
        if(topic.includes("received")){
          console.log("Message received: ", JSON.parse(message.message.message).payload)
        }
      }
    }
  }, [message])
  return (<>{props?.children}</>)
}

const ArduinoView = (props)=>{
  // console.log("ArduinoView: ", props)
  // const message = useSubscription(eventsPath, { qos: 1 })
  const [isConnected, setIsConnected] = useState(false)
  const deviceId = props.arduino.name

  API.get(`/api/core/v1/arduinos/connectedDevices`).then((res)=>{
    res.data?.connectedDevices.forEach((device)=>{
      console.log(device)
      if(device === props.arduino.name){
        setIsConnected(true)
        return;
      }else{
        setIsConnected(false)
      }
    })
  }).catch((err)=>{
    console.error("Error getting connected devices: ", err)
  })

  return (
    <YStack>
      <EventsSubscription setIsConnected={setIsConnected} deviceId={deviceId}>
        <Text>{`Arduino Component`}</Text>
      </EventsSubscription>
      <Text>{`Status: ${isConnected}`}</Text>
      <Button onPress={()=>{API.get(`/api/core/v1/arduinos/${deviceId}/connect`)}}>Connect</Button>
      <Button onPress={()=>{API.get(`/api/core/v1/arduinos/${deviceId}/disconnect`)}}>Disconnect</Button>              
    </YStack>
  )
}

const SelectGrid = ({ children }) => {
  return <XStack jc="center" ai="center" gap={25} flexWrap='wrap'>
      {children}
  </XStack>
}

const SecondSlide = ({ data, setData, error, setError, objects }) => {
  return <ScrollView height={"250px"}>
    <YStack>
      <Text>Slide 2</Text>
    </YStack>
      {/* <EditableObject
          externalErrorHandling={true}
          error={error}
          setError={setError}
          data={data}
          setData={setData}
          numColumns={apiTemplates[data['data'].template].extraFields ? 2 : 1}
          mode={'add'}
          title={false}
          model={APIModel}
          extraFields={{
              ...(apiTemplates[data['data'].template].extraFields ? apiTemplates[data['data'].template].extraFields(objects) : {}),
              dynamic: z.boolean().after("name").label("dynamic automation").defaultValue(true)
          }}
      /> */}
  </ScrollView>
}

const FirstSlide = ({ selected, setSelected }) => {
  return <YStack>
      <ScrollView height={"250px"}>
          {/* <SelectGrid>
              {Object.entries(apiTemplates).map(([templateId, template]) => (
                  <TemplateCard
                      key={templateId}
                      template={template}
                      isSelected={selected === templateId}
                      onPress={() => setSelected(templateId)}
                  />
              ))}
          </SelectGrid> */}
          <YStack>
            <Text>You will get the information soon</Text>
          </YStack>
      </ScrollView>
      <Spacer marginBottom="$8" />
  </YStack>
}

const addDialog = (setAddOpen, addOpen, apiTemplates, data, setData,...props)=>{
  return (<AlertDialog
  p={"$2"}
  pt="$5"
  pl="$5"
  setOpen={setAddOpen}
  open={addOpen}
  hideAccept={true}
  description={""}
>
  <YStack f={1} jc="center" ai="center">
      <XStack mr="$5">
          <Slides
              lastButtonCaption="Create"
              id='arduinos'
              onFinish={async () => {
                  // try {
                  //     //TODO: when using custom data and setData in editablectObject
                  //     //it seems that defaultValue is no longer working
                  //     //we are going to emulate it here until its fixed
                  //     const obj = APIModel.load(data['data'])
                  //     if (apiTemplates[data['data'].template].extraValidation) {
                  //         const check = apiTemplates[data['data'].template].extraValidation(data['data'])
                  //         if (check?.error) {
                  //             throw check.error
                  //         }
                  //     }
                  //     const result = await API.post(sourceUrl, obj.create().getData())
                  //     if (result.isError) {
                  //         throw result.error
                  //     }
                  //     setAddOpen(false);
                  //     toast.show('Automation created', {
                  //         message: obj.getId()
                  //     })
                  // } catch (e) {
                  //     setError(getPendingResult('error', null, e instanceof z.ZodError ? e.flatten() : e))
                  // }
                  console.log("Create new Arduino")
              }}
              slides={[
                  {
                      name: "Create new Arduino",
                      title: "Select your Template",
                      //component: <FirstSlide selected={data?.data['template']} setSelected={(tpl) => setData({ ...data, data: { ...data['data'], template: tpl } })} />
                      component: <FirstSlide selected={""} setSelected={(add)=>{console.log("Add: ",add)}} />

                  },
                  {
                      name: "Arduino",
                      title: "Configure your Arduino",
                      //component: <SecondSlide error={error} objects={objects} setError={setError} data={data} setData={setData} />
                      component: <SecondSlide error={""} objects={""} setError={""} data={""} setData={""}></SecondSlide>
                  }
              ]
              }></Slides>
      </XStack>
  </YStack>
</AlertDialog>)
}

export default {
    arduinos: {
      component: ({ workspace, pageState, initialItems, itemData, pageSession, extraData }: any) => {
        const router = useRouter()
        const defaultData = { data: { template: 'custom-api' } }
        const [data, setData] = useState(defaultData)
        const [addOpen, setAddOpen] = useState(false)


        return (<AdminPage title="Arduinos" workspace={workspace} pageSession={pageSession}>
          {addDialog(setAddOpen, addOpen, {}, data, setData)}
          <DataView
            entityName={"arduinos"}
            itemData={itemData}
            rowIcon={BookOpen}
            sourceUrl={sourceUrl}
            initialItems={initialItems}
            numColumnsForm={1}
            // onAddButton={async () => {
            //   setAddOpen(true)
            // }}
            onAdd={(data) => { 
              //router.push(`/arduinos/${data.name}`); 
              return data
            }}
            name="Arduino"
            onEdit={data => { console.log("DATA (onEdit): ", data); return data }}
            onSelectItem={(item) => router.push(`/arduinos/${item.data.name}`)}
            columns={DataTable2.columns(
              DataTable2.column("name", row => row.name, "name")
            )}
            model={ArduinosModel}
            pageState={pageState}
            dataTableGridProps={{
              getCard: (element, width) => <ArduinoPreview
                onDelete={async () => {
                }}
                onPress={() => console.log("Go to: ", element )}
                element={element} width={width} />,
            }}
            defaultView={"grid"}
          />
        </AdminPage>)
      },
      getServerSideProps: PaginatedData(sourceUrl, ['admin'])
    },
    view: {
      component: ({ workspace, pageState, initialItems, itemData, pageSession, extraData, arduino, icons }: any) => {
        const { data } = arduino
        console.log("Arduino: ", data)
        return( <AdminPage title="Arduinos" workspace={workspace} pageSession={pageSession}>
           <ArduinoView arduino={data} />
          </AdminPage>)
      },
      getServerSideProps: SSR(async (context) => withSession(context, ['admin'], async (session) => {
        return {
          arduino: await API.get(`/api/core/v1/arduinos/${context.params.arduino}/?token=${session?.token}`),
          icons: (await API.get(`/api/core/v1/icons?token=${session?.token}`))?.data?.icons ?? []
        }
      }))
    }
  }