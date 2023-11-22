import { YStack } from 'tamagui'
import { Scrollbars } from 'react-custom-scrollbars-2';

export const SideMenu = ({sideBarColor='$background', children, ...props}:any) => {
    return <YStack bw={0} bc={sideBarColor} {...props}>
            <YStack $sm={{display:'none'}} width={245} height="100%">
                <Scrollbars universal height="100%">
                    {children}
                </Scrollbars>
            </YStack>
    </YStack>
}
