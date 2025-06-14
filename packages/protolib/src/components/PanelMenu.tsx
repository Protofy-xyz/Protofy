import { YStack, XStack } from '@my/ui'
import {
    Server,
    Box,
    Boxes,
    ChevronDown,
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
    Layers,
    Minus
} from '@tamagui/lucide-icons'
import { Accordion, Input, Paragraph, SizableText, Square, ScrollView } from '@my/ui'
import { usePathname, useSearchParams } from 'solito/navigation';
import { useState } from 'react';
import { API, getPendingResult } from 'protobase';
import { AlertDialog } from './AlertDialog';
import { Link } from './Link';
import { Tinted } from './Tinted';
import { PanelMenuItem } from './PanelMenuItem';
import { SelectList } from './SelectList';
import { useQueryState } from '../next'
import { useThemeSetting } from '@tamagui/next-theme'

const opacity = 0.8
const strokeWidth = 2
const color = '$gray9'
const size = 20

const appId = process.env.NEXT_PUBLIC_APP_ID;

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

const replaceFirstCharIfSlash = (str) => (str.startsWith('/') ? str.replace(/^./, '') : str);
const healthCheckLinkRoute = (str) => {
    if (appId == 'adminpanel' && str.startsWith('/workspace/')) {
        //remove /workspace/ from the start of the string
        str = str.replace('/workspace/', '/')
    }
    return str.startsWith('/') ? str : ("/" + str)
};

const getSubtabHref = (subtab) => subtab.href ?? (subtab.type + subtab.path).replace(/\/+/g, '/')
const isSubtabSelected = (href, pathname) => href.includes(pathname) && pathname != '/'
const isTabSelected = (subtabs) => subtabs.some((subtab) => {
    const href = getSubtabHref(subtab)
    return isSubtabSelected(href, usePathname())
})

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
                const response = await API.post('/api/core/v1/templates/' + subtab.options.templates[0].options.type, {
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

const Subtabs = ({ tabs, subtabs, collapsed }: any) => {
    const pathname = usePathname();

    return (
        <YStack f={1} gap="$1">
            {subtabs.map((subtab, index) => {
                if (subtab.type == 'create') return <CreateDialog subtab={subtab} key={index} />
                let href = getSubtabHref(subtab)
                const originalHref = href

                const content = <Tinted>
                    <PanelMenuItem
                        collapsed={collapsed}
                        selected={isSubtabSelected(href, pathname)}
                        // selected={replaceFirstCharIfSlash(pathname).startsWith(replaceFirstCharIfSlash(originalHref.replace(/\/$/, '').replace(/\?.*$/, '')))}
                        icon={getIcon(subtab.icon)}
                        text={subtab.name}
                    />
                </Tinted>
                if (subtab.external || (!subtab.href?.startsWith('/workspace/') && appId == 'adminpanel')) {
                    return <a href={href} key={index}>
                        {content}
                    </a>
                }
                return <Link href={healthCheckLinkRoute(href)} key={index}>
                    {content}
                </Link>

            })}
        </YStack>)
}

const Tabs = ({ tabs, environ, collapsed }: any) => {
    const { resolvedTheme } = useThemeSetting()
    return (tabs ?
        <YStack f={1}>
            {Object.keys(tabs).map((tab, index) => {
                if (tabs[tab].length === undefined) {
                    return <Subtabs tabs={tabs} subtabs={[tabs[tab]]} />
                }
                const tabContent = tabs[tab].filter(t => !t.visibility || t.visibility.includes(environ))
                if (!tabContent.length) return <></>
                return (
                    <Accordion value={collapsed ? ("a" + index) : undefined} collapsible={!collapsed} defaultValue={"a" + index} br={"$6"} overflow="hidden" type="single" key={index}>
                        <Accordion.Item value={"a" + index}>
                            <Accordion.Trigger
                                p={"$2"}
                                backgroundColor={"$backgroundTransparent"}
                                focusStyle={{ backgroundColor: "$backgroundTransparent" }}
                                hoverStyle={{ backgroundColor: '$backgroundTransparent' }}
                                bw={0} flexDirection="row" justifyContent="space-between">
                                {({ open }) => (
                                    //@ts-ignore
                                    <XStack f={1} h="40px" jc="center" p={"$2"} animateOnly={['backgroundColor']} animation="bouncy" br="$4" backgroundColor={isTabSelected(tabContent) && !open ? (resolvedTheme == "dark" ? '$color2' : '$color4') : '$backgroundTransparent'}>
                                        {!collapsed && <SizableText f={1} ml={"$2.5"} fontWeight="bold" size={"$5"}>{tab}</SizableText>}
                                        {/* @ts-ignore */}
                                        <Square animation="bouncy" rotate={open ? '180deg' : '0deg'}>
                                            {
                                                collapsed 
                                                    ? <Minus color="$gray6" size={20}/>
                                                    : <ChevronDown color={isTabSelected(tabContent) && !open ? '$color8' : '$gray9'} size={20} />
                                            }
                                        </Square>
                                    </XStack>
                                )}
                            </Accordion.Trigger>
                            <Accordion.Content position="relative" backgroundColor={"$backgroundTransparent"} pt={'$0'} pb={"$2"} >
                                <Subtabs collapsed={collapsed} tabs={tabs} subtabs={tabContent} />
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion>
                )
            })}
        </YStack> : <></>
    );
};
const disableEnvSelector = true
export const PanelMenu = ({ workspace, collapsed }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [environ, setEnviron] = useState()

    const query = Object.fromEntries(searchParams.entries());
    const [state, setState] = useState(query)
    useQueryState(setState)

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
                {pathname && searchParams && !disableEnvSelector && <SelectList
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
        <Tinted>
            <ScrollView showsVerticalScrollIndicator={false} pl={"$0"} pt={"$3"} mah="calc( 100vh - 150px ) "><Tabs tabs={workspace.menu} collapsed={collapsed}/></ScrollView>
        </Tinted>

    </YStack>)
}