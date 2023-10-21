import { YStack, XStack } from 'tamagui'
import { getPendingResult, API, PanelMenuItem, AlertDialog, Link, Tinted} from 'protolib'
import { Box, ChevronDown, Database, Folder, Plus, Workflow, Users, Repeat, Zap, Tag, Library, Lamp, FunctionSquare, Factory, Leaf, LineChart, Replace, ReplaceAll} from '@tamagui/lucide-icons'
import { Accordion, Input, Paragraph, SizableText, Square } from '@my/ui'
import { useRouter } from 'next/router';
import { useState } from 'react';
import {useAtom, useSetAtom} from 'jotai'
import { workspaceAtom } from '..';

const opacity = 0.7
const strokeWidth = 0.8
const color = '$color8'

const iconTable = {
    database: <Database color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    model: <Box color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    api: <Workflow color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    create: <Plus color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    users: <Users color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    events: <Zap color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    automation: <Repeat color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    groups: <Tag color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    library: <Library color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    lamp: <Lamp color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    function: <FunctionSquare color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    factory: <Factory color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    leaf: <Leaf color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    chart: <LineChart color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    replace: <Replace color={color} opacity={opacity} strokeWidth={strokeWidth} />,
    replaceAll: <ReplaceAll color={color} opacity={opacity} strokeWidth={strokeWidth} />
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
                if (subtab.type == 'create') return <CreateDialog subtab={subtab} key={index} />
                return <Link href={subtab.href} key={index}>
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
                    <Accordion defaultValue={["a"+index]} br={"$6"} overflow="hidden" type="multiple" key={index}>
                        <Accordion.Item value={"a" + index}>
                            <Accordion.Trigger
                                backgroundColor={"$backgroundTransparent"}
                                focusStyle={{ backgroundColor: "$backgroundTransparent" }}
                                hoverStyle={{ backgroundColor: "$backgroundTransparent" }}
                                bw={0} flexDirection="row" justifyContent="space-between">
                                {({ open }) => (
                                    <XStack f={1}>
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