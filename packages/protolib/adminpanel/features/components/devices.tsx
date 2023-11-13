import {Center} from 'protolib'
import DeviceScreen from 'protodevice';

type DevicesAdminProps = {
    deviceDefinition: any
}


export default function DevicesAdmin({deviceDefinition}:DevicesAdminProps) {
    return (
        <Center>
            <DeviceScreen deviceDefinition={deviceDefinition}></DeviceScreen>
        </Center>
    )
}