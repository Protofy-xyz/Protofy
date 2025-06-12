import React from 'react'
import { YStack, useMedia, Button, Square } from '@my/ui'
import { useState } from 'react'
import { PanelLeftOpen, PanelLeftClose, ArrowLeftToLine } from '@tamagui/lucide-icons'

export const SideMenu = ({ sideBarColor = '$background', children, ...props }: any) => {
    const isXs = useMedia().xs
    const [open, setOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const width = collapsed ? 80 : 260

    return <YStack bw={0} bc={sideBarColor} {...props} onDoubleClick={() => setCollapsed(!collapsed)}>
        <YStack
            animateOnly={["width"]}
            // @ts-ignore
            animation="quick"
            width={width}
            height="0"
            flex={1}
            overflow={"hidden"}
            $sm={{
                position: 'absolute',
                zIndex: 100,
                height: '100%',
                backgroundColor: "$backgroundStrong",
                display: open ? 'flex' : 'none',
            }}
            style={{ overflowY: 'auto' }}
        >
            {React.cloneElement(children, { ...children.props, collapsed })}
        </YStack>
        <YStack
            m="$4"
            onPress={() => setCollapsed(!collapsed)}
            p="$2"
            als={collapsed ? "center" : "flex-end"}
            cursor='pointer'
            hoverStyle={{ backgroundColor: '$gray4' }}
            br="$4"
        >
            {/* @ts-ignore */}
            <Square animation="quick" rotate={collapsed ? '180deg' : '0deg'}>
                <ArrowLeftToLine size={20} color="$gray9" />
            </Square>
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
                position="fixed"
                zIndex={99999}
                left="16px"
                top="15px"
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