import React, { useState } from "react";
import { XStack, YStack, Text, Paragraph, Button, Input, Spinner, Switch } from '@my/ui';
import { ContainerLarge } from 'protolib';
import { Tinted } from 'protolib';
import { Chip } from 'protolib';
import { useMqttState, useSubscription } from 'protolib';
import { useFetch } from 'protolib'
import { DeviceSubsystemMonitor, getPeripheralTopic } from 'protolib/src/bundles/devices/devices/devicesSchemas';

const Monitor = ({ deviceName, monitorData, subsystem }) => {
    const monitor = new DeviceSubsystemMonitor(deviceName, subsystem.name, monitorData)
    // Define the state hook outside of JSX mapping
    const [value, setValue] = useState<any>(undefined);
    //const value = 'test'
    const { message } = useSubscription(monitor.getEndpoint())
    const [result, loading, error] = useFetch(monitor.getValueAPIURL())
    const [scale, setScale] = useState(1);

    React.useEffect(() => {
        setValue(message?.message?.toString())
        setScale(1.15);
        setTimeout(() => {
            setScale(1);
        }, 200);
    }, [message])
    return (
        <XStack gap="$3">
            <Text flex={1} marginLeft={4} textAlign={"left"}>{monitor.getLabel()}: </Text>
            {/**@ts-ignore */}
            {(loading || (value === undefined && result?.value === undefined)) ? <Spinner color="$color7" /> : <Chip color={value === undefined ? 'gray' : '$color5'} text={`${value ?? result?.value} ${monitor.getUnits()}`} scale={scale} animation="bouncy" ></Chip>}
        </XStack>
    );
}

const Action = ({ deviceName, action, buttonAction }) => {
    const [value, setValue] = useState(
        action.payload.type == "json-schema" ?

        action.payload.schema ? Object.keys(action.payload.schema).reduce((acc, key) => {
            acc[key] = "";
            return acc;
        }
        , {}) : {}

        : "");

        return (action.payload.value ?

        <Button
            key={action.name} // Make sure to provide a unique key for each Button
            onPress={() => { buttonAction(action) }}
            color="$color10"
            //@ts-ignore
            title={"Description: " + action.description}
            flex={1}
        >
            {action.label ?? action.name}
        </Button>

        : action.payload.type != "json-schema" ? 

        <XStack gap="$3">
            <Input
                //@ts-ignore
                value={value}
                onChange={async (e:any) => setValue(e.target.value)}
                width={80}
                placeholder="value"
                mr={8}
                flex={1}
            />
            <Button
                key={action.name} // Make sure to provide a unique key for each Button
                onPress={() => { buttonAction(action, value) }}
                color="$color10"
                //@ts-ignore
                title={"Description: " + action.description}
                flex={1}
            >
                {action.label ?? action.name}
            </Button>
        </XStack>
        : 
        <YStack gap="$2" alignSelf='flex-start'  alignItems="center" marginTop="10px" marginBottom="10px" flex={1} width="$20">
            <XStack gap="$3" flexWrap='wrap'>
            {
                Object.keys(value).map((key, index) => {
                    return <Input
                        key={index}
                        value={value[key]}
                        onChange={async (e:any) => {
                            setValue({ ...value, [key]: e.target.value })
                        }}
                        width="$10"
                        placeholder={key}
                        flex={2}
                    />
                })
            }
            </XStack>
            <Button
                key={action.name} // Make sure to provide a unique key for each Button
                onPress={() => { buttonAction(action, value) }}
                color="$color10"
                //@ts-ignore
                title={"Description: " + action.description}
                width="100%"
                flex={2}
            >
                {action.label ?? action.name}
            </Button>
        </YStack>
    )
}
const subsystem = ({ subsystem, deviceName }) => {
    const { client } = useMqttState();
    const eventGenerationFlag = false;

    const buttonAction = (action, value?) => {
        const sendValue = value != undefined ? value : action.payload.value
        if (action.connectionType == "mqtt") {
            console.log("MQTT Dev: ", action.payload)
            client.publish(getPeripheralTopic(deviceName, action.endpoint), (action.payload.type == "json" || action.payload.type == "json-schema") ? JSON.stringify(sendValue) : sendValue.toString())
        }
    }

    // Map the actions to buttons and return them as JSX
    const actionButtons = subsystem.actions?.map((action, key) => {
        return <Action key={key} deviceName={deviceName} action={action} buttonAction={buttonAction} />
    });

    const monitorLabels = subsystem.monitors?.map((monitorData, key) => {
        return <Monitor key={key} deviceName={deviceName} monitorData={monitorData} subsystem={subsystem} />
    });

    return (
        <ContainerLarge position="relative" borderRadius="10px" mt="10px">
            <Tinted>
                <XStack alignItems="center" justifyContent="space-between">
                    <Paragraph textAlign='left' color={'$color10'}>{subsystem.name}</Paragraph>
                    {eventGenerationFlag?<Switch id={"pa"} size="$2" defaultChecked={subsystem.generateEvent}>
                        {/*@ts-ignore*/}
                        <Switch.Thumb animation="quick" />
                    </Switch>:null}
                </XStack>
                <YStack marginBottom="10px" marginTop="10px" alignSelf='flex-start'>
                    {actionButtons?.length > 0 ? <XStack gap="$2" flexWrap='wrap' marginTop="10px" marginBottom="10px">
                        {actionButtons}
                    </XStack> : null}
                    {monitorLabels?.length > 0 ? <XStack gap="$3" flexWrap='wrap' marginTop="10px" marginBottom="10px">
                        {monitorLabels}
                    </XStack> : null}
                </YStack>
            </Tinted>
        </ContainerLarge>

    );
}

export default subsystem