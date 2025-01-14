import { YStack, useMedia, Button } from 'tamagui'
import { useState } from 'react'
import { X, PanelLeftOpen, PanelLeftClose } from '@tamagui/lucide-icons'
import { Tinted } from '../Tinted'

export const SideMenu = ({ sideBarColor = '$background', children, ...props }: any) => {
    const isXs = useMedia().xs
    const [open, setOpen] = useState(false)
    const width = 260

    return <YStack bw={0} bc={sideBarColor} {...props}>
        <YStack
            width={width}
            height="0"
            flex={1}
            $sm={{
                position: 'absolute',
                zIndex: 100,
                height: '100%',
                backgroundColor: "$backgroundStrong",
                display: open ? 'flex' : 'none',
            }}
            style={{ overflowY: 'auto' }}
        >
            {children}
        </YStack>
        {isXs && <>
            <YStack
                backgroundColor="$background"
                h="100%"
                width='100vw'
                display={open ? 'flex' : 'none'}
                onPress={e => {
                    setOpen(false)
                    e.stopPropagation()
                }}
            ></YStack>
            
            <Button
                onPress={() => setOpen(!open)}
                position="absolute"
                zIndex={99999}
                left={8}
                top="-40px"
                icon={open ? PanelLeftClose : PanelLeftOpen}
                scaleIcon={1.5}
                size="$3"
                backgroundColor="transparent"
                circular
            >
            </Button>
        </>}
    </YStack>
}
