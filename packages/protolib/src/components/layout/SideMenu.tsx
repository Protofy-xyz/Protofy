import { YStack, useMedia, Button } from 'tamagui'
import { useState } from 'react'
import { X, PanelLeftOpen } from '@tamagui/lucide-icons'
import { Tinted } from '../Tinted'

export const SideMenu = ({ sideBarColor = '$background', children, ...props }: any) => {
    const isXs = useMedia().xs
    const [open, setOpen] = useState(false)
    const width = 260
    const xsMenuMargin = 5

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
        {isXs && <Tinted>
            <Button
                onPress={() => setOpen(!open)}
                position="absolute"
                zIndex={999}
                left={open ? (width + xsMenuMargin) : xsMenuMargin}
                top="$10"
                icon={open ? X : PanelLeftOpen}
                scaleIcon={1.5}
                size="$5"
                theme={open ? 'red' : undefined}
                circular
            >
            </Button>
        </Tinted>}
    </YStack>
}
