import { YStack, XStack, Stack } from 'tamagui'
import { API, PanelMenuItem, AlertDialog} from 'protolib'
import { Box, ChevronDown, Database, Folder, Plus, PlusCircle, Workflow, X } from '@tamagui/lucide-icons'
import { Accordion, Button, Dialog, Fieldset, Input, Label, Link, Paragraph, SizableText, Spacer, Square, TooltipSimple, Unspaced } from '@my/ui'
import { useRouter } from 'next/router';
import { useState } from 'react';

const iconTable = {
    database: <Database color="$color11" strokeWidth={1.5} />,
    model: <Box color="$color11" strokeWidth={1.5} />,
    api: <Workflow color="$color11" strokeWidth={1.5} />,
    create: <Plus color="$color11" strokeWidth={1.5} />
}
const getIcon = (icon) => {
    if (!iconTable[icon]) {
        return <Folder color="$color11" strokeWidth={1.5} />
    } else {
        return iconTable[icon]
    }
}

const CreateDialog = ({subtab}) => {
    const [name, setName] = useState('')
    return <XStack onPress={() => { }}>
        <AlertDialog
            onAccept={async (setOpen) => {
                await API.post('/adminapi/v1/templates/'+subtab.options.template, {
                    name: name,
                    data: {...subtab}
                })
                // setName('')
                // setOpen(false)
            }}
            title={subtab.options?.title??"Create a new "+subtab.options.template}
            trigger={<PanelMenuItem
                icon={getIcon(subtab.icon)}
                text={subtab.name}
                mb={'$4'}
            />}
            description={subtab.options?.description ?? ("Use a simple name for your "+subtab.options.template+", related to what your "+subtab.options.template+" does.")}
        >
            <XStack f={1} jc="center" ai="center">
                <Input value={name} onChangeText={(text) => setName(text)} f={1} mx={"$8"} textAlign='center' id="name" placeholder={subtab.options?.placeholder ?? 'name...'} />
            </XStack>
            
        </AlertDialog>
    </XStack>
}

const Subtabs = ({ subtabs }: any) => {
    const router = useRouter()
    return (
        <>
            {subtabs.map((subtab, index) => {
                if (subtab.type == 'create') return <CreateDialog subtab={subtab} />
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
                                focusStyle={{ backgroundColor: "$backgroundTransparent" }}
                                hoverStyle={{ backgroundColor: "$backgroundTransparent" }}
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