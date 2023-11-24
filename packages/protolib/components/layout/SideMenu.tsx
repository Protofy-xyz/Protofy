import { YStack } from 'tamagui'

export const SideMenu = ({sideBarColor='$background', children, ...props}:any) => {
    return <YStack bw={0} bc={sideBarColor} {...props}>
            <YStack $sm={{display:'none'}} width={245} height="0" overflow='scroll' flex={1}>
                {children}
            </YStack>
    </YStack>
}
