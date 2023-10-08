import { YStack, XStack } from 'tamagui'
import { getPendingResult, API, PanelMenuItem, AlertDialog, Link, Tinted} from 'protolib'
import { Box, ChevronDown, Database, Folder, Plus, Workflow, Users} from '@tamagui/lucide-icons'
import { Accordion, Input, Paragraph, SizableText, Square } from '@my/ui'
import { useRouter } from 'next/router';
import { useState } from 'react';
import {useAtom, useSetAtom} from 'jotai'
import { workspaceAtom } from '..';

const opacity = 0.7
const strokeWidth = 0.6
const color = '$color8'
const iconTable = {
    database: <Database color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    model: <Box color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    api: <Workflow color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    create: <Plus color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    users: <Users color={color} opacity={opacity} strokeWidth={strokeWidth} />
}
const getIcon = (icon) => {
    if (!iconTable[icon]) {
        return <Folder color={color} opacity={opacity} strokeWidth={strokeWidth} />
    } else {
        return iconTable[icon]
    }
}

const CreateDialog = ({subtab}) => {
    const [name, setName] = useState('')
    const [result, setResult] = useState(getPendingResult("pending"))
    const setWorkspace = useSetAtom(workspaceAtom)
    const template = subtab.options.templates[0]

    if(!template) {
        throw "Invalid template specified in workspace file: "+ subtab.options.templates[0]
    }

    return <XStack onPress={() => { }}>
        <AlertDialog
            onAccept={async (setOpen) => {
                const response = await API.post('/adminapi/v1/templates/'+subtab.options.templates[0].options.type, {
                    name: name,
                    data: {
                        options: subtab.options.templates[0].options,
                        path: subtab.path
                    }
                })
                //@ts-ignore
                if(response.isLoaded) {
                    setWorkspace(await API.get('/adminapi/v1/workspaces'))
                    setName('')
                    setOpen(false)
                    setResult(getPendingResult("pending"))
                } else {
                    setResult(response)
                }
            }}
            title={template.title??"Create a new "+subtab.options.templates[0]}
            trigger={<PanelMenuItem
                icon={getIcon(subtab.icon)}
                text={subtab.name}
                mb={'$4'}
            />}
            description={template.description ?? ("Use a simple name for your "+subtab.options.templates[0]+", related to what your "+subtab.options.templates[0]+" does.")}
        >
            <YStack f={1} jc="center" ai="center">
                {result.isError?<Paragraph mb={"$5"} color="$red10">Error: {result.error?.error}</Paragraph>:null}
                <Input value={name} onChangeText={(text) => setName(text)} f={1} mx={"$8"} textAlign='center' id="name" placeholder={template.placeholder ?? 'name...'} />
            </YStack>
            
        </AlertDialog>
    </XStack>
}

const Subtabs = ({ subtabs }: any) => {
    const router = useRouter()
    return (
        <>
            {subtabs.map((subtab, index) => {
                if (subtab.type == 'create') return <CreateDialog subtab={subtab} />
                return <Link href={subtab.href}>
                    <Tinted>
                        <PanelMenuItem
                            selected={router.asPath.startsWith(subtab.href.replace(/\/$/, ''))}
                            icon={getIcon(subtab.icon)}
                            text={subtab.name}
                        />
                    </Tinted>

                </Link>
            })}
        </>)
}

const Tabs = ({ tabs }: any) => {
    return (tabs ?
        <>
            {Object.keys(tabs).map((tab, index) => {
                if(tabs[tab].length === undefined){
                    return <Subtabs subtabs={[tabs[tab]]} />
                }
                return (
                    <Accordion br={"$6"} overflow="hidden" type="multiple" key={index}>
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
                                        <SizableText f={1} size={"$5"}>{tab}</SizableText>
                                        <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                                            <ChevronDown size="$1" />
                                        </Square>
                                    </XStack>
                                )}
                            </Accordion.Trigger>
                            <Accordion.Content backgroundColor={"$backgroundTransparent"} pt={'$0'}>
                                <Subtabs subtabs={tabs[tab]} />
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion>
                )
            })}
        </> : <></>
    );
};

export const PanelMenu = () => {
    const [workspace] = useAtom(workspaceAtom)
    return (<YStack mx={"$4"} pt="$6">
        <Tabs tabs={workspace.data?.menu} />
    </YStack>)
}