import { useMqttState, useSubscription } from 'mqtt-react-hooks';
import React, { useState } from "react";
import { XStack, YStack, Text, Paragraph, Button, } from '@my/ui';
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
    const actionButtons = subsystem.actions?.map(action => (
        <Button
            key={action.name} // Make sure to provide a unique key for each Button
            onPress={() => { buttonAction(action) }}
            color="$color10"
        //style={{ border: "1px solid #cccccc", borderRadius: "5px", marginRight: "5px", padding: "10px" }}
        >
            {action.label ?? action.name}
        </Button>
    ));

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
                    <XStack gap="$2">
                        {actionButtons}
                    </XStack>

                    <YStack alignItems={'left'} gap="$3">
                        {monitorLabels}
                    </YStack>
                </YStack>
            </Tinted>
        </ContainerLarge>

    );
}

export default subsystem