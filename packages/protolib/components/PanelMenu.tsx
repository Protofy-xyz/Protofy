import { YStack, XStack } from 'tamagui'
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
    AlertTriangle
} from '@tamagui/lucide-icons'
import { Accordion, Input, Paragraph, SizableText, Square, ScrollView } from '@my/ui'
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { getPendingResult, API } from 'protolib/base';
import { AlertDialog, Link, Tinted, PanelMenuItem, AppConfContext, SiteConfigType, TabGroup } from 'protolib';
import { useThemeSetting } from '@tamagui/next-theme'

const opacity = 0.8
const strokeWidth = 2
const color = '$color8'
const size = 20
const disableTabsInSideBar = true

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

const Subtabs = ({ subtabs }: any) => {
    const router = useRouter()
    const SiteConfig = useContext<SiteConfigType>(AppConfContext);
    const isDev = process.env.NODE_ENV === 'development';
    //fix component not rendering correctly on the first render on client
    const [hrefProtocol, setHrefProtocol] = useState(undefined)
    const [hrefHost, setHrefHost] = useState(undefined)
    const { resolvedTheme } = useThemeSetting()

    useEffect(() => {
        if(isDev) {
            setHrefProtocol(window.location.protocol)
            setHrefHost(window.location.hostname)
        }
    }, [])

    return (
        <>
            {subtabs.map((subtab, index) => {
                if (subtab.type == 'create') return <CreateDialog subtab={subtab} key={index} />
                let href = (SiteConfig.workspaceRoot == '/' ? '' : SiteConfig.workspaceRoot) + '/' + (subtab.type + subtab.path).replace(/\/+/g, '/')
                href = SiteConfig.getProductionURL(href, hrefProtocol, hrefHost)
                // if(typeof window !== 'undefined' && (hrefPort !== undefined && window.location.port !== hrefPort)) {
                if (isDev) {
                    return hrefProtocol && hrefHost && <a href={href} key={index}>
                        <Tinted>
                            <PanelMenuItem
                                selected={router.asPath.startsWith(href.replace(/\/$/, ''))}
                                icon={getIcon(subtab.icon)}
                                text={subtab.name}
                            />
                        </Tinted>
                    </a>
                } 

                return <Link href={href} key={index}>
                    <Tinted>
                        <PanelMenuItem
                            selected={router.asPath.startsWith(href.replace(/\/$/, ''))}
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
        <YStack f={1}>
            {Object.keys(tabs).map((tab, index) => {
                if (tabs[tab].length === undefined) {
                    return <Subtabs subtabs={[tabs[tab]]} />
                }
                
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
                                <Subtabs subtabs={tabs[tab]} />
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion>
                )
            })}
        </YStack> : <></>
    );
};

export const PanelMenu = ({ workspace }) => {
    return (<YStack pt="$5">
        {!disableTabsInSideBar && <TabGroup 
            containerProps={{
                borderWidth: 0,
                backgroundColor: "$backgroundTransparent"
            }}
            tabs={["PLAYGROUND", "PUBLISHED"]}
        >
            <ScrollView pl={"$2"} pt={"$4"} mah="calc( 100vh - 150px ) "><Tabs tabs={workspace.menu} /></ScrollView>
            <ScrollView pl={"$2"} pt={"$4"} mah="calc( 100vh - 150px ) "><Tabs tabs={workspace.menu} /></ScrollView>
         </TabGroup> }

         {disableTabsInSideBar && <ScrollView pl={"$2"} pt={"$4"} mah="calc( 100vh - 150px ) "><Tabs tabs={workspace.menu} /></ScrollView>}
        
    </YStack>)
}