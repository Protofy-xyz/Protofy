import { useMqttState, useSubscription  } from 'mqtt-react-hooks';
import React, {useState} from "react";
import { XStack, YStack, Text } from '@my/ui';
import { getDeviceName } from '../../device/Device';

const projectName = 'projectName'
const deviceName = getDeviceName()

const subsystem = (subsystem, nodeData, type) => {
    const { client } = useMqttState();
    const mqttUrlBase = projectName + '/mydevice/'+ type + '/' + nodeData["param1"]?.replaceAll('"','')

    const buttonAction = (action) => {
        if(action.connectionType == "mqtt"){
            client.publish(mqttUrlBase+action.endpoint, action.payload.value)
        }
    }
    
    // Map the actions to buttons and return them as JSX
    const actionButtons = subsystem.actions?.map(action => (
        <button
            key={action.name} // Make sure to provide a unique key for each button
            onClick={() => { buttonAction(action) }}
            style={{ border: "1px solid #cccccc", borderRadius: "5px", marginRight: "5px", padding: "10px" }}>
            {action.name}
        </button>
    ));

    const monitorLabels = subsystem.monitors?.map(monitor => {
        // Define the state hook outside of JSX mapping
        const [value, setValue] = useState('');
        const { message } = useSubscription(mqttUrlBase+monitor.endpoint)
    
        React.useEffect(() => {
            setValue(message?.message?.toString())
        }, [message])
        return (
          <XStack>
            <Text marginLeft={4} textAlign={"left"} color="warmGray.300">{monitor.name}: </Text>
            <Text color={!value ? "grey" : 'blue'}>
              {value ? value : 'offline'}
            </Text>
          </XStack>
        );
      });
    

    return (
        <YStack alignItems={'center'}>
            <XStack mt="10px" mb="10px" alignItems={'center'}>
                {actionButtons}
            </XStack>
            <YStack mt="10px" mb="10px" alignItems={'center'}>
                {monitorLabels}
            </YStack>
        </YStack>
    );
}

export default subsystem