import {Center} from 'protolib'
import DeviceScreen from 'protodevice';
import { Connector } from 'mqtt-react-hooks';

type DevicesAdminProps = {
    deviceDefinition: any
}


export default function DevicesAdmin({deviceDefinition}:DevicesAdminProps) {
    return (
        <Connector brokerUrl="ws://bo-firmware.protofy.xyz/ws">
            <Center>
                <DeviceScreen deviceDefinition={deviceDefinition}></DeviceScreen>
            </Center>
        </Connector>
    )
}