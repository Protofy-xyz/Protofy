import { useMqttState, useSubscription } from 'mqtt-react-hooks';
import React, { useState } from "react";
import { XStack, YStack, Text, Paragraph, Button, Input } from '@my/ui';
import { ElevatedArea, ContainerLarge, Tinted, Chip } from 'protolib';
import { getPeripheralTopic } from 'protolib/bundles/devices/devices/devicesSchemas';

const subsystem = (subsystem, deviceName) => {
    const { client } = useMqttState();

    const buttonAction = (action) => {
        if (action.connectionType == "mqtt") {
            console.log("MQTT Dev: ", action.payload)
            client.publish(getPeripheralTopic(deviceName, action.endpoint),action.payload.type=="json"? JSON.stringify(action.payload.value):action.payload.value.toString())
        }
    }

    // Map the actions to buttons and return them as JSX
    const actionButtons = subsystem.actions?.map(action => {
        const [value, setValue] = useState('');

        return(action.payload.value ?

        <Button
            key={action.name} // Make sure to provide a unique key for each Button
            onPress={() => { buttonAction(action) }}
            color="$color10"
            title={"Description: " + action.description}
        >
            {action.label ?? action.name}
        </Button>
        
        :<XStack gap="$3">
            <Input
                value={value}
                onChange={async (e) =>  setValue(e.target.value)}
                width={80}
                placeholder="value"
                mr={8}
            />
            <Button
                key={action.name} // Make sure to provide a unique key for each Button
                onPress={() => { 
                    console.log("HOLAAAA", value)
                    client.publish(getPeripheralTopic(deviceName, action.endpoint),action.payload.type=="json"? JSON.stringify(value):value.toString())
                }}
                color="$color10"
                title={"Description: " + action.description}
            >
                {action.label ?? action.name}
            </Button>
        </XStack>);

    });

    const monitorLabels = subsystem.monitors?.map(monitor => {
        // Define the state hook outside of JSX mapping
        const [value, setValue] = useState('');
        //const value = 'test'
        const { message } = useSubscription(getPeripheralTopic(deviceName, monitor.endpoint))

        React.useEffect(() => {
            setValue(message?.message?.toString())
        }, [message])

        const renderChip = value ? (
            <Chip text={`${value} ${monitor.units ? monitor.units : ''}`}></Chip>
        ) : null;

        return (
            <XStack gap="$3">
                <Text marginLeft={4} textAlign={"left"}>{monitor.label ?? monitor.name}: </Text>
                {renderChip}
            </XStack>
        );
    });


    return (
        <ContainerLarge position="relative" borderRadius="10px" mt="10px">
            <Tinted>
                <Paragraph textAlign='left' color={'$color10'}>{subsystem.name}</Paragraph>
                <YStack mb="10px" mt="10px" alignSelf='flex-start'>
                    <YStack gap="$2">
                        {actionButtons}
                    </YStack>

                    <YStack alignItems={'left'} gap="$3">
                        {monitorLabels}
                    </YStack>
                </YStack>
            </Tinted>
        </ContainerLarge>

    );
}

export default subsystem