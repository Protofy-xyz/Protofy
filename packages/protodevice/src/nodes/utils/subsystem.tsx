import { useMqttState, useSubscription } from 'mqtt-react-hooks';
import React, { useState } from "react";
import { XStack, YStack, Text, Paragraph, Button } from '@my/ui';
import { ElevatedArea, ContainerLarge, Tinted } from 'protolib';


const subsystem = (subsystem, deviceName) => {
    const { client } = useMqttState();

    const buttonAction = (action) => {
        if (action.connectionType == "mqtt") {
            client.publish(deviceName + action.endpoint, action.payload.value.toString())
            console.log("🚀 ~ file: subsystem.tsx:12 ~ buttonAction ~ deviceName+action.endpoint, action.payload.value:", deviceName + action.endpoint, action.payload.value)
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
            {action.name}
        </Button>
    ));

    const monitorLabels = subsystem.monitors?.map(monitor => {
        // Define the state hook outside of JSX mapping
        const [value, setValue] = useState('');
        //const value = 'test'
        const { message } = useSubscription(deviceName + monitor.endpoint)
        console.log("🚀 ~ file: subsystem.tsx:32 ~ monitorLabels ~ deviceName+monitor.endpoint:", deviceName + monitor.endpoint)

        React.useEffect(() => {
            setValue(message?.message?.toString())
        }, [message])
        return (
            <XStack>
                <Text marginLeft={4} textAlign={"left"}>{`${monitor.name}: ${value}`}</Text>
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

                    <YStack alignItems={'center'}> 
                    <Text >
                        {monitorLabels}
                    </Text>
                    </YStack>
                </YStack>
            </Tinted>
        </ContainerLarge>

    );
}

export default subsystem