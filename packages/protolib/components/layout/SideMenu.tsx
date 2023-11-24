import { YStack } from 'tamagui'

export const SideMenu = ({sideBarColor='$background', children, ...props}:any) => {
    return <YStack bw={0} bc={sideBarColor} {...props}>
            <YStack $sm={{display:'none'}} width={245} height="0" flex={1} style={{overflowY:'auto'}}>
                {children}
            </YStack>
    </YStack>
}
