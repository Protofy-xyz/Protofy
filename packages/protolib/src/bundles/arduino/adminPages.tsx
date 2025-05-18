import React, { useEffect, useRef} from "react";
import { AdminPage } from "../../components/AdminPage"
import { useRouter } from 'solito/navigation';
import { DataView, DataViewActionButton } from "../../components/DataView"
import { PaginatedData, SSR } from "../../lib/SSR"
import { withSession } from "../../lib/Session"
import { API } from 'protobase'
import { ArduinosModel } from "./arduinosSchemas";
import { DataTable2 } from "../../components/DataTable2"
import { YStack, Text, XStack, ScrollView, Spacer, Button, TextArea, Paragraph,Switch, Input, useToastController} from "@my/ui";
import { useState } from 'react'
import { BookOpen, Sparkles} from '@tamagui/lucide-icons'
import { AlertDialog } from "../../components/AlertDialog"
import {Slides} from "../../components/Slides"
import { TemplateCard } from '../apis/TemplateCard';
import { useSubscription } from "protolib/lib/mqtt";
import { RulesSideMenu } from '../../components/autopilot/RulesSideMenu'
import { Rules } from '../../components/autopilot/Rules'
import { useThemeSetting } from '@tamagui/next-theme'
import { Tinted } from '../../components/Tinted'
import { DashboardGrid } from '../../components/DashboardGrid';
import { SelectList } from "../../components/SelectList";


  const apiTemplates={
    "existing-project": {
      name: "Existing Project",
      description: "Connect Protofy to an existing project",
      
    },
    "blank-project": {
      name: "Blank Project",
      description: "Create a new project from scratch",
    }
  }
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
  console.log("ArduinoView: ", props)
  // const message = useSubscription(eventsPath, { qos: 1 })
  const [isConnected, setIsConnected] = useState(false)
  const [rulesOpened, setRulesOpened] = useState(true)
  const [savedPhysicalRules, setSavedPhysicalRules] = useState(props.arduino.physicalRules ?? [])
  const [savedRules, setSavedRules] = useState(props.arduino.rules ?? [])
  const deviceId = props.arduino.name
  // const [descriptionTextAreaContent, setDescriptionTextAreaContent] = useState(props.arduino.physicalDescription)
  // const [behaviourTextAreaContent, setBehaviourTextAreaContent] = useState(props.arduino.behaviourDescription)
  // const behaviourTextAreaRef = useRef(null)
  const descriptionTextAreaRef = useRef(null)
  const { resolvedTheme } = useThemeSetting()
  const darkMode = resolvedTheme == 'dark'

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
  // console.log("aadasd: ", {current:props.arduino})
  return (
    <YStack f={1} padding="$4" gap={20}>
      
      <EventsSubscription setIsConnected={setIsConnected} deviceId={deviceId}>
        <XStack jc="space-between">
          <Text fontSize={30}>{`${deviceId} - ${props.arduino.projectPath}`}</Text>
          <Tinted>
            <XStack userSelect="none" ai="center" jc="center" mr="$5">
              <XStack mr="$3">
                <XStack opacity={rulesOpened ? 1.0 : 0.6} hoverStyle={{ opacity: 1 }} pressStyle={{ opacity: 0.8 }} cursor="pointer" onPress={() => {
                  setRulesOpened(!rulesOpened)
                }}>
                  <Sparkles size={25} color={"var(--color9)"} />
                </XStack>
              </XStack>
            </XStack>
          </Tinted>
        </XStack>
      </EventsSubscription>
      <Text mt="$4" fow="600">Transport config</Text>
      {props.arduino?.transport?.type=="serial"?<>
      <XStack>
        <YStack>
          <Text>{`Is connected? ${isConnected}`}</Text>
          <Text>{`Port: ${props.arduino.transport?.config?.port}`}</Text>
          <Text>{`Baudrate: ${props.arduino.transport?.config?.baudrate}`}</Text>
          <Text>{`Is autoconnected? ${props.arduino.transport?.config?.autoconnect}`}</Text>

        </YStack>
      </XStack>
      <XStack width={"$size.10"} gap={5}>
        <Button  onPress={()=>{API.get(`/api/core/v1/arduinos/${deviceId}/connect`)}}>Connect</Button>
        <Button  onPress={()=>{API.get(`/api/core/v1/arduinos/${deviceId}/disconnect`)}}>Disconnect</Button>
      </XStack>
      </>:<> </>
      }
      <Text mt="$4" fow="600">Digital twin</Text>
      <Tinted><Text fontSize="$5" color="$bgContentDark" fow="600">Aqui va un board</Text></Tinted>
      {/* <DashboardGrid
                items={cards}
                layouts={layouts}
                borderRadius={10}
                padding={10}
                backgroundColor="white"
                onLayoutChange={(layout, layouts) => {
                  // boardRef.current.layouts = layouts
                  // API.post(`/api/core/v1/boards/${board.name}`, boardRef.current)
                }}
              /> */}
      <Text mt="$4" fow="600">Physical description</Text>
      {/* <TextArea ref={descriptionTextAreaRef.current} value={descriptionTextAreaContent} onChangeText={(t)=>{setDescriptionTextAreaContent(t)}}></TextArea> */}
      <Tinted>
        <YStack height="10" alignItems="center" justifyContent="center" boxShadow="0 0 10px rgba(0,0,0,0.1)" borderRadius="$3" >
          <Rules
              rules={savedPhysicalRules ?? []}
              onAddRule={(e, rule) => {
                  setSavedPhysicalRules([...(savedPhysicalRules ?? []), rule])
              }}
              onDeleteRule={(index) => {
                  setSavedPhysicalRules(savedPhysicalRules.filter((_, i) => i != index))
              }}
              onEditRule={(index, rule) => {
                  const newRules = [...savedPhysicalRules]
                  newRules[index] = rule
                  setSavedPhysicalRules(newRules)
              }}
              loadingIndex={-1}
          />
        </YStack>
      </Tinted>
      {/* <Text mt="$4" fow="600">Behaviour</Text>
      <TextArea ref={behaviourTextAreaRef.current} value={behaviourTextAreaContent} onChangeText={(t)=>{setBehaviourTextAreaContent(t)}}></TextArea> */}
      {/* <XStack position="fixed" animation="quick" right={rulesOpened ? 0 : -1000} top={130} width={810} height="80vh">
        <XStack width="100%" br={9} height={"100%"} position="absolute" top="0" left="0" backgroundColor={darkMode ? 'black' : 'white'} opacity={0.9}></XStack>
        <RulesSideMenu boardRef={{current:props.arduino}} board={props.arduino} applyRulesAction={(newRules)=>{console.log("newRules: ", newRules)}}></RulesSideMenu>
      </XStack> */}
      {/* <RulesSideMenu boardRef={{current:props.arduino}} board={props.arduino} applyRulesAction={(newRules)=>{console.log("newRules: ", newRules)}}></RulesSideMenu> */}
      <Text mt="$4" fow="600">Rules</Text>
      <Tinted>
        <YStack height="10" alignItems="center" justifyContent="center" boxShadow="0 0 10px rgba(0,0,0,0.1)" borderRadius="$3" >
          <Rules
              rules={savedRules ?? []}
              onAddRule={(e, rule) => {
                  setSavedRules([...(savedRules ?? []), rule])
              }}
              onDeleteRule={(index) => {
                  setSavedRules(savedRules.filter((_, i) => i != index))
              }}
              onEditRule={(index, rule) => {
                  const newRules = [...savedRules]
                  newRules[index] = rule
                  setSavedRules(newRules)
              }}
              loadingIndex={-1}
          />

          
          <YStack mt="auto" pt="$3">
            <Button onPress={async ()=>{
              console.log("Arduino: ", props.arduino); 
              console.log("savedRules: ",savedRules); 
              console.log("descriptionTextAreaContent: ",savedPhysicalRules)
              const newArduino ={...props.arduino, rules: savedRules, physicalRules: savedPhysicalRules}
              console.log("new Arduino: ", newArduino)
              const prepromt = `You are an expert in Arduino programming. 
              Minimize the use of external libraries.
              You have to create a code for the Arduino with the following rules: ${newArduino.rules.join(", ")}. 
              The physical description of the board is: ${newArduino.physicalRules.join(", ")}.
              The transport for comunicating the arduino with the server is ${newArduino.transport.type} with the following config: ${JSON.stringify(newArduino.transport.config)}.
              To avoid errors with the transport layer, it's better to use this transport layer available just using #include "protofy.hpp" in your code:
              #pragma once
#include <Arduino.h>

class ProtofyWriter {
public:
  virtual void print(const String& msg) = 0;
  virtual void println(const String& msg) {
    print(msg + "\n");
  }
};

class StreamWriter : public ProtofyWriter {
public:
  StreamWriter(Stream& stream) : _stream(stream) {}
  void print(const String& msg) override {
    _stream.print(msg);
  }
private:
  Stream& _stream;
};

typedef void (*ProtofyCallback)(const String* params, size_t count);

#define MAX_CALLBACKS 10

class Protofy {
public:
  Protofy(Stream& stream) : _stream(stream), _writer(new StreamWriter(stream)), _callbackCount(0) {}

  template <typename T>
  void send(const String& deviceName, const String& name, const T& value) {
    _writer->print("PFY->" + deviceName + "->" + name + "->" + String(value) + "\n");
  }

  void on(const char* name, ProtofyCallback cb) {
    if (_callbackCount < MAX_CALLBACKS) {
      _callbacks[_callbackCount].name = name;
      _callbacks[_callbackCount].callback = cb;
      _callbackCount++;
    }
  }

  String loop() {
    String nonProtofy = "";
    while (_stream.available()) {
      char c = _stream.read();
      _inputBuffer += c;

      if (c == '\n') {
        if (_inputBuffer.startsWith("PFY->")) {
          handleProtofyLine(_inputBuffer);
        } else {
          nonProtofy += _inputBuffer;
        }
        _inputBuffer = "";
      }
    }
    return nonProtofy;
  }

private:
  struct CallbackEntry {
    const char* name;
    ProtofyCallback callback;
  };

  CallbackEntry _callbacks[MAX_CALLBACKS];
  uint8_t _callbackCount;
  ProtofyWriter* _writer;
  Stream& _stream;
  String _inputBuffer;

  void handleProtofyLine(const String& line) {
    String tokens[10];
    size_t count = 0;
    int start = 5;

    while (count < 10) {
      int end = line.indexOf("->", start);
      if (end == -1) {
        String last = line.substring(start);
        last.trim();
        tokens[count++] = last;
        break;
      }
      tokens[count++] = line.substring(start, end);
      start = end + 2;
    }

    if (count < 1) return;
    String funcName = tokens[0];

    for (uint8_t i = 0; i < _callbackCount; ++i) {
      if (funcName == _callbacks[i].name) {
        _callbacks[i].callback(&tokens[1], count - 1);
        return;
      }
    }

    _writer->println("Unknown PFY function: " + funcName);
  }
};
              `
              const postprompt = `
              You're in a middle of a connection system in order to work you need to give me a js function: newArduinoCode("here as an String all the code for the Arduino").
              Any response that includes text or any other structure than javascrip, won't work.
              Your response will be procesed not by a human or AI will be procesed by nodejs script
              `
              console.log("prompt: ", prepromt+ " "+postprompt)
              const saveResponse = await API.post(`/api/core/v1/arduinos/${props.arduino.name}`, {...newArduino})
              console.log("Save response: ", saveResponse)
                
              const chatGPTresponse = await API.post(`/api/core/v1/arduinos/${props.arduino.name}/generateCode`, {prompt: prepromt+ " "+postprompt})
              console.log("ChatGPT response: ", chatGPTresponse)
              console.log("ChatGPT response: ", chatGPTresponse.data.choices[0].message.content)
              
//               Tengo una Romeo Board con un ESP32 S3.
// He conectado un motor DC
// El pin 12 es la velocidad.
// El pin 13 es la direccion.

            }}>Apply</Button>
          </YStack>
        </YStack>
      </Tinted>
    </YStack>
)}

const SelectGrid = ({ children }) => {
  return <XStack jc="center" ai="center" gap={25} flexWrap='wrap'>
      {children}
  </XStack>
}

const SecondSlide = ({ data, setData, error, setError, objects }) => {
  const [serialPorts, setSerialPorts] = useState([]);
  const searchSerialPorts = async ()=>{
    const ports = await API.get('/api/core/v1/transports/serial/ports/available')
    // console.log("Serial ports: ", ports)
    if(ports.isLoaded){
      setSerialPorts(ports.data)
    }
  }
  searchSerialPorts()
  // console.log("SecondSlide: ", data)
  return <ScrollView height={"250px"}>
    <YStack>
      <Text>Name</Text>
      <Input value={data.data["name"]??""} onChangeText={(t)=>setData({ ...data, data: { ...data['data'], name: t }})} placeholder="Name"></Input>
    </YStack>
    {data.data['template'] == "existing-project"?
      <YStack mt="$4">
        <Text>Path</Text>
        <Input value={data.data["path"]??""} onChangeText={(t)=>setData({ ...data, data: { ...data['data'], path: t }})} placeholder="Path"></Input>
      </YStack>
    : <> </>}
    <YStack mt="$4">
      <Text mb="$2">Serial Transport</Text>
      <SelectList title="Select a Version" elements={serialPorts.map((release, index) => ({ caption: release, value: release }))} value={data.data["serialPort"]??""} setValue={(t)=>setData({ ...data, data: { ...data['data'], serialPort: t }})} />
      {/* <select >
        {serialPorts.map((port, index) => (
          <option key={index} value={port}>
            {port}
          </option>
        ))}
      </select> */}
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
          <SelectGrid>
              {Object.entries(apiTemplates).map(([templateId, template]) => (
                  <TemplateCard
                      key={templateId}
                      template={template}
                      isSelected={selected === templateId}
                      onPress={() => setSelected(templateId)}
                  />
              ))}
          </SelectGrid>
      </ScrollView>
      <Spacer marginBottom="$8" />
  </YStack>
}

const addDialog = (setAddOpen, addOpen, apiTemplates, data, setData,...props)=>{
  const toast = useToastController();
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
                console.log("Finish: ", data.data)
                const res = await API.post( `/api/core/v1/arduinos`, {name:data.data.name,projectPath: data.data.path ,transport: {type: "serial", config: {port: data.data.serialPort, baudrate: 115200, autoconnect: true}}})
                console.log("Response: ", res)
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
                  
                  setAddOpen(false);
                  console.log("Create new Arduino")
                  toast.show('Arduino created', {message: data.data.name})
              }}
              slides={[
                  {
                      name: "Create new Arduino",
                      title: "Choose an option",
                      component: <FirstSlide selected={data?.data['template']} setSelected={(tpl) => setData({ ...data, data: { ...data['data'], template: tpl } })} />
                      //component: <FirstSlide selected={selected} setSelected={(template)=>{setSelected(template); console.log("Add: ",template)}} />

                  },
                  {
                      name: "Arduino",
                      title: "Configure your Arduino",
                      //component: <SecondSlide error={error} objects={objects} setError={setError} data={data} setData={setData} />
                      component: <SecondSlide error={""} objects={""} setError={""} data={data} setData={setData}></SecondSlide>
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
            onAddButton={async () => {
              setAddOpen(true)
            }}
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