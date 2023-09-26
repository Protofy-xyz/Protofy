import { YStack, XStack, Stack } from 'tamagui'
import { PanelMenuItem } from 'protolib'
import { Box, ChevronDown, Database, Folder, Workflow } from '@tamagui/lucide-icons'
import { Accordion, Link, SizableText, Square } from '@my/ui'
import { useRouter } from 'next/router';

const Subtabs = ({ subtabs }: any) => {
    const router = useRouter()

    const iconTable = {
        database: <Database color="$color11" strokeWidth={1.5} />,
        model: <Box color="$color11" strokeWidth={1.5} />,
        api: <Workflow color="$color11" strokeWidth={1.5} />
    }
    const getIcon = (icon) => {
        if(!iconTable[icon]) {
            return <Folder color="$color11" strokeWidth={1.5} />
        } else {
            return iconTable[icon]
        }
    } 
    return (
        <>
            {subtabs.map((subtab, index) => {
                return <Link href={subtab.href} onPressApp={() => { }} >
                    <PanelMenuItem
                        mb={'$4'}
                        selected={router.asPath.startsWith(subtab.href.replace(/\/$/, ''))}
                        icon={getIcon(subtab.icon)}
                        text={subtab.name}
                    />
                </Link>
            })}
        </>)
}

const Tabs = ({ tabs }: any) => {
    return (tabs ?
        <>
            {Object.keys(tabs).map((tab, index) => {
                return (
                    <Accordion br={"$6"} overflow="hidden" type="multiple" mb={'$4'} key={index}>
                        <Accordion.Item value={"a" + index}>
                            <Accordion.Trigger 
                            backgroundColor={"$backgroundTransparent"} 
                            focusStyle={{backgroundColor: "$backgroundTransparent"}}
                            hoverStyle={{backgroundColor: "$backgroundTransparent"}}
                            bw={0} flexDirection="row" justifyContent="space-between">
                                {({ open }) => (
                                    <XStack f={1}>
                                        {/* <Stack mr={"$3"}>
                                            <Database color="$color11" strokeWidth={1.5} />
                                        </Stack> */}
                                        <SizableText f={1} size={"$5"} fontWeight={800}>{tab}</SizableText>
                                        <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                                            <ChevronDown size="$1" />
                                        </Square>
                                    </XStack>
                                )}
                            </Accordion.Trigger>
                            <Accordion.Content backgroundColor={"$backgroundTransparent"} pt={'$4'}>
                                <Subtabs subtabs={tabs[tab]} />
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion>
                )
            })}
        </> : <></>
    );
};

export const PanelMenu = ({ menu }: any) => {
    return (<YStack mx={"$4"} pt="$10">
        <Tabs tabs={menu} />
    </YStack>)
}