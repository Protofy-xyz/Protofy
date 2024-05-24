import { YStack, XStack, Separator } from 'tamagui'
import {
    Server,
    Box,
    Boxes,
    ChevronDown,
    Database,
    Folder,
    Plus,
    Workflow,
    Users,
    Repeat,
    Zap,
    Tag,
    Library,
    Lamp,
    FunctionSquare,
    Factory,
    Leaf,
    LineChart,
    Replace,
    ReplaceAll,
    Book,
    Milk,
    Layout,
    DoorOpen,
    Cpu,
    CircuitBoard,
    Columns,
    LayoutList,
    Unplug,
    PersonStanding,
    BookOpen,
    ServerCog,
    ClipboardList,
    AlertTriangle,
    Cog,
    Layers
} from '@tamagui/lucide-icons'
import { Accordion, Input, Paragraph, SizableText, Square, ScrollView } from '@my/ui'
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { getPendingResult, API } from 'protolib/base';
import { AlertDialog, Link, Tinted, PanelMenuItem, AppConfContext, SiteConfigType, TabGroup, useWorkspaceRoot } from 'protolib';
import { useThemeSetting } from '@tamagui/next-theme'
import { SelectList } from './SelectList';
import { usePageParams, useQueryState } from 'protolib/next'
import { useUpdateEffect } from 'usehooks-ts';

const opacity = 0.8
const strokeWidth = 2
const color = '$color8'
const size = 20


const iconTable = {
    database: <Server color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    model: <Box color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    api: <Workflow color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    create: <Plus color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    users: <Users color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    events: <Zap color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    zap: <Zap color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    automation: <Repeat color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    groups: <Tag color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    library: <Library color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    lamp: <Lamp color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    function: <FunctionSquare color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    factory: <Factory color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    leaf: <Leaf color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    chart: <LineChart color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    replace: <Replace color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    replaceAll: <ReplaceAll color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    boxes: <Boxes color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    box: <Box color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    book: <Book color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    bottle: <Milk color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    layout: <Layout color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    doorOpen: <DoorOpen color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    cpu: <Cpu color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    board: <CircuitBoard color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    layoutList: <LayoutList color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    columns: <Columns color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    unplug: <Unplug color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    human: <PersonStanding color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    bookOpen: <BookOpen color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    serverConf: <ServerCog color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    activity: <ClipboardList color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />,
    alert: <AlertTriangle color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />
}

const getIcon = (Icon) => {
    if (typeof Icon === "string") {
        if (!iconTable[Icon]) {
            return <Folder color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />
        } else {
            return iconTable[Icon]
        }
    } else {
        return <Icon color={color} size={size} opacity={opacity} strokeWidth={strokeWidth} />
    }
}

const CreateDialog = ({ subtab }) => {
    const [name, setName] = useState('')
    const [result, setResult] = useState(getPendingResult("pending"))
    const template = subtab.options.templates[0]

    if (!template) {
        throw "Invalid template specified in workspace file: " + subtab.options.templates[0]
    }

    return <XStack onPress={() => { }}>
        <AlertDialog
            onAccept={async (setOpen) => {
                const response = await API.post('/adminapi/v1/templates/' + subtab.options.templates[0].options.type, {
                    name: name,
                    data: {
                        options: subtab.options.templates[0].options,
                        path: subtab.path
                    }
                })
                //@ts-ignore
                if (response.isLoaded) {
                    setName('')
                    setOpen(false)
                    setResult(getPendingResult("pending"))
                } else {
                    setResult(response)
                }
            }}
            title={template.title ?? "Create a new " + subtab.options.templates[0]}
            trigger={<PanelMenuItem
                icon={getIcon(subtab.icon)}
                text={subtab.name}
                mb={'$4'}
            />}
            description={template.description ?? ("Use a simple name for your " + subtab.options.templates[0] + ", related to what your " + subtab.options.templates[0] + " does.")}
        >
            <YStack f={1} jc="center" ai="center">
                {result.isError ? <Paragraph mb={"$5"} color="$red10">Error: {result.error?.error}</Paragraph> : null}
                <Input value={name} onChangeText={(text) => setName(text)} f={1} mx={"$8"} textAlign='center' id="name" placeholder={template.placeholder ?? 'name...'} />
            </YStack>

        </AlertDialog>
    </XStack>
}

const Subtabs = ({ tabs, subtabs }: any) => {
    const router = useRouter()
    const SiteConfig = useContext<SiteConfigType>(AppConfContext);
    const isDev = process.env.NODE_ENV === 'development';
    //fix component not rendering correctly on the first render on client
    const [hrefProtocol, setHrefProtocol] = useState(undefined)
    const [hrefHost, setHrefHost] = useState(undefined)
    const { resolvedTheme } = useThemeSetting()
    const workspaceRoot = useWorkspaceRoot()

    useEffect(() => {
        if (isDev) {
            setHrefProtocol(window.location.protocol)
            setHrefHost(window.location.hostname)
        }
    }, [])

    return (
        <>
            {subtabs.map((subtab, index) => {
                if (subtab.type == 'create') return <CreateDialog subtab={subtab} key={index} />
                
                const segment = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] || SiteConfig.defaultWorkspace : SiteConfig.defaultWorkspace;

                let href = "/" + workspaceRoot + '/' + segment + '/' + (subtab.type + subtab.path).replace(/\/+/g, '/')
                const originalHref = href
                
            
                //href = SiteConfig.getProductionURL(href, hrefProtocol, hrefHost)

                // if(typeof window !== 'undefined' && (hrefPort !== undefined && window.location.port !== hrefPort)) {
                // if (isDev) {
                //     return hrefProtocol && hrefHost && <a href={href} key={index}>
                //         <Tinted>
                //             <PanelMenuItem
                //                 selected={router.asPath.startsWith(originalHref.replace(/\/$/, ''))}
                //                 icon={getIcon(subtab.icon)}
                //                 text={subtab.name}
                //             />
                //         </Tinted>
                //     </a>
                // }


                const allLinks = Object.keys(tabs).reduce((acc, tab) => {
                    if (tabs[tab].length === undefined) {
                        return acc
                    }
                    return acc.concat(tabs[tab])
                }, [])

                const maxSelectedLength = allLinks.reduce((acc, tab) => {
                    const segment = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] || SiteConfig.defaultWorkspace : SiteConfig.defaultWorkspace;
                    let href = "/" + workspaceRoot + '/' + segment + '/' + (tab.type + tab.path).replace(/\/+/g, '/')
                    if (router.asPath.startsWith(href.replace(/\/$/, ''))) {
                        return href.length > acc ? href.length : acc
                    }
                    return acc
                }, 0)

                return <Link href={href} key={index}>
                    <Tinted>
                        <PanelMenuItem
                            selected={router.asPath.startsWith(originalHref.replace(/\/$/, '')) && originalHref.length == maxSelectedLength}
                            icon={getIcon(subtab.icon)}
                            text={subtab.name}
                        />
                    </Tinted>
                </Link>
            })}
        </>)
}

const Tabs = ({ tabs, environ }: any) => {
    return (tabs ?
        <YStack f={1}>
            {Object.keys(tabs).map((tab, index) => {
                if (tabs[tab].length === undefined) {
                    return <Subtabs tabs={tabs} subtabs={[tabs[tab]]} />
                }
                const tabContent = tabs[tab].filter(t => !t.visibility || t.visibility.includes(environ))
                if (!tabContent.length) return <></>
                return (
                    <Accordion defaultValue={["a" + index]} br={"$6"} overflow="hidden" type="multiple" key={index}>
                        <Accordion.Item value={"a" + index}>
                            <Accordion.Trigger
                                p={"$2"}
                                backgroundColor={"$backgroundTransparent"}
                                focusStyle={{ backgroundColor: "$backgroundTransparent" }}
                                hoverStyle={{ backgroundColor: '$backgroundTransparent' }}
                                bw={0} flexDirection="row" justifyContent="space-between">
                                {({ open }) => (
                                    <XStack f={1} jc="center">
                                        <Square animation="quick" rotate={open ? '0deg' : '-90deg'}>
                                            <ChevronDown size={20} />
                                        </Square>
                                        <SizableText f={1} ml={"$2.5"} fontWeight="bold" size={"$5"}>{tab}</SizableText>

                                    </XStack>
                                )}
                            </Accordion.Trigger>
                            <Accordion.Content position="relative" left={-10} pl="$0" backgroundColor={"$backgroundTransparent"} pt={'$0'} pb={"$2"} >
                                <Subtabs tabs={tabs} subtabs={tabContent} />
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion>
                )
            })}
        </YStack> : <></>
    );
};
const disableEnvSelector = true
export const PanelMenu = ({ workspace }) => {
    const { resolvedTheme } = useThemeSetting()
    const { query, isReady } = useRouter();
    const [environ, setEnviron] = useState()
    const [state, setState] = useState(query)
    const { push, removePush } = usePageParams(state)
    useQueryState(setState)

    // if(isReady) {
    //     console.log('ready query: ', query)
    // }

    // useUpdateEffect(() => {
    //     if(!environ) return
    //     if(environ == 'development') {
    //         removePush('env')
    //         return
    //     }

    //     push('env', environ)
        
    // }, [environ])

    return (<YStack pt="$3">
        <Tinted>
            <YStack ai="center" mt={"$2"} ml={"$5"} mr={"$5"}>
                {isReady && !disableEnvSelector && <SelectList
                    value={environ ?? query.env}
                    setValue={setEnviron}
                    rawDisplay={true}
                    triggerProps={{
                        bc: "transparent",
                        borderWidth: 0,
                        outlineWidth: 1,
                        borderBottomWidth: 2,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        chromeless: false
                    }}
                    title="Environment"
                    elements={[
                        {
                            value: "development", caption: <XStack space="$3">
                                <Boxes opacity={0.7} size={20} />
                                <SizableText size="$3">Development</SizableText>
                            </XStack>
                        }, {
                            value: "production", caption: <XStack space="$3">
                                <Layers opacity={0.7} size={20} />
                                <SizableText size="$3">Production</SizableText>
                            </XStack>
                        }]}
                />}
            </YStack>
            {/* <Separator f={1} borderBottomWidth={4} /> */}
        </Tinted>

        <ScrollView pl={"$2"} pt={"$3"} mah="calc( 100vh - 150px ) "><Tabs tabs={workspace.menu} /></ScrollView>

    </YStack>)
}