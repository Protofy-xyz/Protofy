import React, { useState } from "react";
import { XStack, YStack, Text, Paragraph, Button, Input, Spinner, Switch, useToastController, Select } from '@my/ui';
import { ContainerLarge } from 'protolib/components/Container';
import { Tinted } from 'protolib/components/Tinted';
import { Chip } from 'protolib/components/Chip';
import { Megaphone, MegaphoneOff, ChevronDown, Check } from "@tamagui/lucide-icons"
import { useMqttState, useSubscription } from 'protolib/lib/mqtt';
import { useFetch } from 'protolib/lib/useFetch'
import { DeviceSubsystemMonitor, getPeripheralTopic } from 'protolib/bundles/devices/devices/devicesSchemas';

const Monitor = ({ deviceName, monitorData, subsystem }) => {
    const monitor = new DeviceSubsystemMonitor(deviceName, subsystem.name, monitorData)
    // Define the state hook outside of JSX mapping
    const [value, setValue] = useState<any>(undefined);
    //const value = 'test'
    const { message } = useSubscription(monitor.getEndpoint())
    const [result, loading, error] = useFetch(monitor.getValueAPIURL())
    const [scale, setScale] = useState(1);
    const [ephemeral, setEphemeral] = useState(monitorData?.ephemeral ?? false);

    const toast = useToastController()

    const onToggleEphemeral = (checked) => {
        setEphemeral(checked)
        fetch("/api/core/v1/devices/" + deviceName + "/subsystems/" + subsystem.name + "/monitors/" + monitor.data.name + "/ephemeral", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: checked })
        })
            .then(response => response.json())
            .then(data => console.log(data))

        toast.show("[" + deviceName + "/" + subsystem.name + "] events are now " + (checked ? '"EPHEMERAL".' : '"PERSISTENT".'), {
            duration: 2000
        })
    }

    React.useEffect(() => {
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
            onPress={() => onToggleEphemeral(!ephemeral)}
        >
            <YStack
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
            </YStack>
            <Text>{monitor.data.label}</Text>
            {(loading || (value === undefined && result?.value === undefined))
                ? <Spinner color="$color7" />
                : <Text
                    fontWeight="600"
                    color={value === undefined ? 'gray' : '$color8'}
                    scale={scale} 
                    animation="bouncy"
                >
                    {`${value ?? result?.value} ${monitor.getUnits()}`}
                </Text>
            }
        </YStack>
    );
}

const Action = ({ deviceName, action }) => {
    const { client } = useMqttState();

    const buttonAction = (action, value?) => {
        const sendValue = value != undefined ? value : action.payload.value
        if (action.connectionType == "mqtt") {
            console.log("MQTT Dev: ", action.payload)
            client.publish(getPeripheralTopic(deviceName, action.endpoint), (action.payload.type == "json" || action.payload.type == "json-schema" || Array.isArray(action?.payload)) ? JSON.stringify(sendValue) : sendValue.toString())
        }
    }

    const [value, setValue] = useState(
        action?.payload?.type == "json-schema" ?

            action?.payload?.schema ? Object.keys(action.payload.schema).reduce((acc, key) => {
                acc[key] = "";
                return acc;
            }
                , {}) : {}

            : "");

    var type
    if (action?.payload?.value) {
        type = "button"
    } else if (Array.isArray(action?.payload)) {
        type = "select"
    } else if (action?.payload?.type != "json-schema") {
        type = "input"
    }

    switch (type) {
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
        case "select":
            const [selectedOption, setSelectedOption] = useState(action.payload[0].value);
            const payloadOptions = Array.isArray(action.payload.value) ? action.payload.value : [];

            console.log("🤖 ~ Action ~ selectedOption:", selectedOption)
            
            return <XStack gap="$3" width={'100%'} alignItems="center">
            <Text whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" maxWidth="150px">{action.label ?? action.name}</Text>
            <Select value={selectedOption} onValueChange={setSelectedOption} disablePreventBodyScroll>
                <Select.Trigger f={1} iconAfter={ChevronDown}>
                    <Select.Value placeholder="Select an option" />
                </Select.Trigger>
                <Select.Content zIndex={9999999999}>
                    <Select.Viewport>
                        <Select.Group>
                            {action.payload.map((item, i) => (
                                <Select.Item key={i} value={item.value}>
                                    <Select.ItemText>{item.label}</Select.ItemText>
                                    <Select.ItemIndicator marginLeft="auto">
                                        <Check size={16} />
                                    </Select.ItemIndicator>
                                </Select.Item>
                            ))}
                        </Select.Group>
                    </Select.Viewport>
                </Select.Content>
            </Select>
            <Button
                key={action.name} // Make sure to provide a unique key for each Button
                onPress={() => { 
                    const selectedPayload = payloadOptions.find(option => option.value === selectedOption);
                    buttonAction(action, selectedPayload ? selectedPayload.value : selectedOption);
                }}
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

// SUBSYSTEM COMPONENT IS NOW DEPRECATED NOW WE USE SUBSYSTEMS COMPONENT
const subsystem = ({ subsystem, deviceName }) => {
    const eventGenerationFlag = false;

    // Map the actions to buttons and return them as JSX
    const actionButtons = subsystem.actions?.map((action, key) => {
        return <Action key={key} deviceName={deviceName} action={action} />
    });

    const monitorLabels = subsystem.monitors?.map((monitorData, key) => {
        return <Monitor key={key} deviceName={deviceName} monitorData={monitorData} subsystem={subsystem} />
    });

    return (
        <ContainerLarge position="relative" borderRadius="10px" mt="10px">
            <Tinted>
                <XStack alignItems="center" justifyContent="space-between">
                    <Paragraph textAlign='left' color={'$color10'}>{subsystem.name}</Paragraph>
                    {eventGenerationFlag ? <Switch id={"pa"} size="$2" defaultChecked={subsystem.generateEvent}>
                        <Switch.Thumb animation="quick" />
                    </Switch> : null}
                </XStack>
                <YStack mb="10px" mt="10px" alignSelf='flex-start'>
                    {actionButtons?.length > 0 ? <XStack gap="$2" flexWrap='wrap' mt="10px" mb="10px">
                        {actionButtons}
                    </XStack> : null}
                    {monitorLabels?.length > 0 ? <XStack gap="$3" flexWrap='wrap' mt="10px" mb="10px">
                        {monitorLabels}
                    </XStack> : null}
                </YStack>
            </Tinted>
        </ContainerLarge>

    );
}

// This componente will be deprecated: Use 'protolib/bundles/agents/subsystems/Subsystems' instead.
// export {Subsystems} from 'protolib/bundles/agents/subsystems/Subsystems'
export const Subsystems = ({ subsystems, deviceName }) => <YStack maxHeight={550} overflow="scroll" padding="$2" paddingTop="20px">
    <>
        <YStack gap="$3">
            {
                subsystems
                    .sort((a, b) => {
                        if (a.monitors && !a.actions && b.actions) return -1;
                        if (!a.monitors && a.actions && b.monitors) return 1;
                        return 0;
                    })
                    .map((subsystem, key) => <>
                        <Text mt="$4" fow="600">{subsystem.name}</Text>
                        {
                            subsystem.monitors?.length > 0 && <>
                                <XStack flexWrap="wrap" gap="$3">
                                    {
                                        subsystem.monitors.map((monitor) => <Monitor key={key} deviceName={deviceName} monitorData={monitor} subsystem={subsystem} />)
                                    }
                                </XStack>
                            </>
                        }
                        {
                            subsystem.actions?.length > 0 && <>
                                <XStack flexWrap="wrap" gap="$3">
                                    {
                                        subsystem.actions.map((action) => <Action key={key} deviceName={deviceName} action={action} />)
                                    }
                                </XStack>
                            </>
                        }
                    </>)

            }
        </YStack>
    </>
</YStack>

export default subsystem