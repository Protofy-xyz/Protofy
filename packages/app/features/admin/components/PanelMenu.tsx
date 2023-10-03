import { YStack, XStack, Stack } from 'tamagui'
import { getPendingResult, API, PanelMenuItem, AlertDialog} from 'protolib'
import { Box, ChevronDown, Database, Folder, Plus, PlusCircle, Workflow, X } from '@tamagui/lucide-icons'
import { Accordion, Button, Dialog, Fieldset, Input, Label, Link, Paragraph, SizableText, Spacer, Square, TooltipSimple, Unspaced } from '@my/ui'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {useAtom, useSetAtom} from 'jotai'
import { workspaceAtom } from '..';
import {getTemplate} from 'common';

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
                if(tabs[tab].length === undefined){
                    return <Subtabs subtabs={[tabs[tab]]} />
                }
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

export const PanelMenu = () => {
    const [workspace] = useAtom(workspaceAtom)
    return (<YStack mx={"$4"} pt="$10">
        <Tabs tabs={workspace.data?.menu} />
    </YStack>)
}