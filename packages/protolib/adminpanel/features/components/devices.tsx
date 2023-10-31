import { YStack } from 'tamagui'
import {Center, BigTitle, RainbowText} from 'protolib'
import DeviceScreen from 'protodevice';
import {Connector} from 'mqtt-react-hooks'

type DevicesAdminProps = {

}

export default function DevicesAdmin({}:DevicesAdminProps) {
    return (
        <Connector brokerUrl="ws://bo-firmware.protofy.xyz/ws">
        <Center>
            {/* <BigTitle>
                Hello <RainbowText>devices</RainbowText>
            </BigTitle> */}
            <DeviceScreen></DeviceScreen>
        </Center>
        </Connector>
    )
}