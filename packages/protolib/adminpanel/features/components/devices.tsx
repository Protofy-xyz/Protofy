import {Center} from 'protolib'
import DeviceScreen from 'protodevice';
import { Connector } from 'mqtt-react-hooks';
import{ onlineCompilerWebSocketUrl } from '../../../bundles/devices/devicesUtils';

type DevicesAdminProps = {
    deviceDefinition: any
}


export default function DevicesAdmin({deviceDefinition}:DevicesAdminProps) {
    return (
        <Connector brokerUrl= {onlineCompilerWebSocketUrl()}>
            <Center>
                <DeviceScreen deviceDefinition={deviceDefinition}></DeviceScreen>
            </Center>
        </Connector>
    )
}