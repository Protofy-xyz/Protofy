import { YStack } from 'tamagui'
import {Center, BigTitle, RainbowText} from 'protolib'
import DeviceScreen from 'protodevice';
import {Connector} from 'mqtt-react-hooks'

type DevicesAdminProps = {
    deviceDefinition: any
}

function CenterContent({deviceDefinition}){
    return (<Center>
        {/* <p>{JSON.stringify(deviceDefinition)}</p> */}
        <DeviceScreen deviceDefinition={deviceDefinition}></DeviceScreen>
    </Center>)
}


export default function DevicesAdmin({deviceDefinition}:DevicesAdminProps) {
    const mqttConfig = deviceDefinition[0].config.mqttServer?deviceDefinition[0].config.mqttServer:null;
    const brokerUrl = mqttConfig? mqttConfig.websocketProtocol+"://"+mqttConfig.broker+mqttConfig.websocketEndpoint: null;
    console.log("Broker Url -> ",brokerUrl)
    return (
        brokerUrl?<Connector brokerUrl={brokerUrl}>
            <CenterContent deviceDefinition={deviceDefinition}/>
        </Connector>:
            <CenterContent deviceDefinition={deviceDefinition}/>
    )
}