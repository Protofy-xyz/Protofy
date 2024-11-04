import React, { useState } from "react";
import { XStack, YStack, Text, Paragraph, Button, Input, Spinner, Switch, useToastController } from '@my/ui';
import { ContainerLarge } from 'protolib/components/Container';
import { Tinted } from 'protolib/components/Tinted';
import { Chip } from 'protolib/components/Chip';
import { Megaphone, MegaphoneOff } from "@tamagui/lucide-icons"
import { useMqttState, useSubscription } from 'protolib/lib/mqtt';
import { useFetch } from 'protolib/lib/useFetch'
import { DeviceSubsystemMonitor, getPeripheralTopic } from 'protolib/bundles/devices/devices/devicesSchemas';
import { defActionEndpoint, defMonitorEndpoint } from "../bifrost/bifrostUtils";
import { ActionType, SubsystemType } from "../subsystems/subsystemSchemas";

const buildActionEndpoint = (type: 'agent' | 'device', name, subsystem, action) => {
  const { name: actionName, endpoint } = action
  const { name: subsystemName } = subsystem

  if (type === "agent") {
    return endpoint ?? defActionEndpoint(name, subsystemName, actionName)
  } else if (type === "device") {
    return getPeripheralTopic(name, endpoint)
  }
}

const buildMonitorEndpoint = (type: 'agent' | 'device', name, subsystem, monitor) => {
  const { name: monitorName, endpoint } = monitor
  const { name: subsystemName } = subsystem

  if (type === 'agent') {
    return monitor.endpoint ?? defMonitorEndpoint(name, subsystemName, monitorName)
  } else {
    return getPeripheralTopic(name, endpoint)
  }
}

const Monitor = ({ type, name, monitorData, subsystem }) => {
  const monitor = new DeviceSubsystemMonitor(name, subsystem.name, monitorData)
  // Define the state hook outside of JSX mapping
  const [value, setValue] = useState<any>(undefined);
  //const value = 'test'
  const { message } = useSubscription(buildMonitorEndpoint(type, name, subsystem, monitorData))
  const [result, loading, error] = useFetch(monitor.getValueAPIURL())
  const [scale, setScale] = useState(1);
  const [ephemeral, setEphemeral] = useState(monitorData?.data?.ephemeral ?? false);

  // const toast = useToastController()

  // const onToggleEphemeral = (checked) => {
  //   setEphemeral(checked)
  //   fetch("/api/core/v1/devices/" + deviceName + "/subsystems/" + subsystem.name + "/monitors/" + monitor.data.name + "/ephemeral", {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ value: checked })
  //   })
  //     .then(response => response.json())
  //     .then(data => console.log(data))

  //   // toast.show("[" + deviceName + "/" + subsystem.name + "] events are now " + (checked ? '"EPHEMERAL".' : '"PERSISTENT".'), {
  //   //   duration: 2000
  //   // })
  // }

  React.useEffect(() => {
    console.log('message---', message)
    setValue(message?.message?.toString())
    setScale(1.15);
    setTimeout(() => {
      setScale(1);
    }, 200);
  }, [message])

  return (
    <YStack
      borderWidth="1px"
      paddingVertical="$2"
      paddingHorizontal="$4"
      gap="$2"
      cursor="pointer"
      borderRadius="$4"
      alignItems="center"
      backgroundColor={ephemeral ? "$color4" : "$transparent"}
      hoverStyle={{ backgroundColor: ephemeral ? "$color6" : "$color2" }}
      // onPress={() => onToggleEphemeral(!ephemeral)}
    >
      {/* <YStack
        backgroundColor={ephemeral ? "$color8" : "$background"}
        position="absolute"
        padding="2px"
        borderRadius={100}
        borderWidth="1px"
        borderColor="$color8"
        right="6px"
        top="-11px"
      >
        {ephemeral ? <MegaphoneOff size={16} color="$background" /> : <Megaphone size={16} color="$color8" />}
      </YStack> */}
      <Text>{subsystem.name}</Text>
      {(loading || (value === undefined && result?.value === undefined))
        ? <Spinner color="$color7" />
        : <Text
          fontWeight="600"
          color={value === undefined ? 'gray' : '$color8'}
          animation="bouncy"
          scale={scale}
        >
          {`${value ?? result?.value} ${monitor.getUnits()}`}
        </Text>
      }
    </YStack>
  );
}

const Action = (
  { type, name, subsystem, action }:
    {
      type: 'agent' | 'device',
      name: string,
      subsystem: SubsystemType, 
      action: ActionType
    }
) => {
  const { client } = useMqttState();

  const buttonAction = (action, value?) => {
    const sendValue = value != undefined ? value : action.payload.value
    // if (action.connectionType == "mqtt") {
    console.log("Subsystems MQTT Dev: ", action.payload)
    console.log('Subsystem Action endpoint: ', buildActionEndpoint(type, name, subsystem, action))
    client.publish(buildActionEndpoint(type, name, subsystem, action), (action.payload.type == "json" || action.payload.type == "json-schema") ? JSON.stringify(sendValue) : sendValue.toString())
    // }
  }

  const [value, setValue] = useState(
    action.payload.type == "json-schema" ?

      action.payload.schema ? Object.keys(action.payload.schema).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }
        , {}) : {}

      : "");

  var actionType
  if (action.payload.value) {
    actionType = "button"
  } else if (action.payload.type != "json-schema") {
    actionType = "input"
  }

  switch (actionType) {
    case "button":
      return <Button
        key={action.name} // Make sure to provide a unique key for each Button
        onPress={() => { buttonAction(action) }}
        color="$color10"
        title={"Description: " + action.description}
        {...action.props}
      >
        {action.label ?? action.name}
      </Button>
    case "input":
      return <XStack gap="$3" width={'100%'} alignItems="center">
        <Text whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" maxWidth="150px">{action.label ?? action.name}</Text>
        <Input
          value={value}
          onChange={async (e) => setValue(e.target.value)}
          width={80}
          placeholder="value"
          // mr={8}
          flex={1}
        />
        <Button
          key={action.name} // Make sure to provide a unique key for each Button
          onPress={() => { buttonAction(action, value) }}
          color="$color10"
          title={"Description: " + action.description}
        >
          Send
        </Button>
      </XStack>
    default:
      return <XStack gap="$3" alignSelf='flex-start' alignItems="center" mt="10px" mb="10px" width="100%">
        <Text whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" maxWidth="150px">{action.label ?? action.name}</Text>
        {
          Object.keys(value).map((key, index) => {
            return <Input
              key={index}
              value={value[key]}
              onChange={async (e) => {
                setValue({ ...value, [key]: e.target.value })
              }}
              width="$10"
              placeholder={key}
              flex={1}
            />
          })
        }
        <Button
          key={action.name} // Make sure to provide a unique key for each Button
          onPress={() => { buttonAction(action, value) }}
          color="$color10"
          title={"Description: " + action.description}
        >
          Send
        </Button>
      </XStack>
  }
}

export const Subsystems = ({ type, subsystems, name }) => <YStack maxHeight={550} overflow="scroll" padding="$2" paddingTop="20px">
  <>
    <XStack flexWrap="wrap" gap="$3">
      {
        subsystems
          .filter((subsystem) => subsystem.monitors?.length > 0)
          .map((subsystem, key) => <>
            {
              subsystem.monitors.map((monitor) => <Monitor key={key} type={type ?? 'device'} name={name} monitorData={monitor} subsystem={subsystem} />)
            }
          </>)
      }
    </XStack>
    <YStack gap="$3">
      {
        subsystems
          .filter((subsystem) => subsystem.actions?.length > 0)
          .map((subsystem, key) => <>
            <Text mt="$4" fow="600">{subsystem.name}</Text>
            <XStack flexWrap="wrap" gap="$3">
              {
                subsystem.actions.map((action) => <Action key={key} type={type ?? 'device'} name={name} action={action} subsystem={subsystem}/>)
              }
            </XStack>
          </>)
      }
    </YStack>
  </>
</YStack>
