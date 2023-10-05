import { YStack } from 'tamagui'
import {Center, BigTitle, RainbowText} from 'protolib'
import DeviceScreen from 'protodevice';

type DevicesAdminProps = {

}

export default function DevicesAdmin({}:DevicesAdminProps) {
    return (

        <Center>
            {/* <BigTitle>
                Hello <RainbowText>devices</RainbowText>
            </BigTitle> */}
            <DeviceScreen></DeviceScreen>
        </Center>
    )
}