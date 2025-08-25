import { YStack, XStack } from '@my/ui'
import {
    Boxes,
    ChevronDown,
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
const color = 'var(--gray9)'
const size = 20

const appId = process.env.NEXT_PUBLIC_APP_ID;

const replaceFirstCharIfSlash = (str) => (str.startsWith('/') ? str.replace(/^./, '') : str);
const healthCheckLinkRoute = (str) => {
    if (appId == 'adminpanel' && str.startsWith('/workspace/')) {
        //remove /workspace/ from the start of the string
        str = str.replace('/workspace/', '/')
    }
    return str.startsWith('/') ? str : ("/" + str)
};

const getSubtabHref = (subtab) => subtab.href ?? (subtab.type + subtab.path).replace(/\/+/g, '/')
const isSubtabMatch = (href: string, pathname: string) => {
    return href.includes(pathname) && pathname != '/'
};

const isTabSelected = (subtabs, shortedMatch) => subtabs.some((subtab) => {
    const href = getSubtabHref(subtab)
    return shortedMatch == href
})

const getShortestMatch = (tabs: string[], pathname: string, searchParams): string | null => {
    const queryStr = searchParams.toString()
    
    let filteredTabs = tabs.filter(href => isSubtabMatch(href, pathname)).sort((a, b) => a.length - b.length);;
    if (filteredTabs.length == 1) return filteredTabs[0];
    else if (filteredTabs.length > 1) {
        const filteredQueryTabs = filteredTabs.filter(href => href.includes(queryStr));
        return filteredQueryTabs ? filteredQueryTabs[0] : filteredTabs[0];
    }
    return null
}

const InternalIcon = ({ name, color, size, opacity }) => <div
    style={{
        opacity: opacity,
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMask: `url('/public/icons/${name}.svg') center / contain no-repeat`,
        mask: `url('/public/icons/${name}.svg') center / contain no-repeat`,
    }}
></div>

const getIcon = (Icon) => {
    if (typeof Icon === "string") {
        return <InternalIcon name={Icon} color={color} size={size} opacity={opacity} />
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

const Subtabs = ({ tabs, subtabs, collapsed, shortedMatch }: any) => {
    return (
        <YStack f={1} gap="$1">
            {subtabs.map((subtab, index) => {
                if (subtab.type == 'create') return <CreateDialog subtab={subtab} key={index} />
                let href = getSubtabHref(subtab)
                const originalHref = href
                const content = <Tinted>
                    <PanelMenuItem
                        collapsed={collapsed}
                        selected={shortedMatch == href}
                        // selected={replaceFirstCharIfSlash(pathname).startsWith(replaceFirstCharIfSlash(originalHref.replace(/\/$/, '').replace(/\?.*$/, '')))}
                        icon={getIcon(subtab.icon)}
                        text={subtab.name}
                        extraLabel={subtab.extraLabel}
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
    const searchParams = useSearchParams();

    const spreadSubtabs = Object.keys(tabs).reduce((acc, key) => {
        if (Array.isArray(tabs[key])) {
            return acc.concat(tabs[key]);
        }
        if (typeof tabs[key] === 'object' && tabs[key] !== null) {
            return acc.concat(tabs[key]);
        }
        return acc;
    }, []);
    
    const hrefList = spreadSubtabs.map(subtab => getSubtabHref(subtab))
    const shortedMatch = getShortestMatch(hrefList, usePathname(), searchParams);

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
                                    <XStack f={1} h="40px" jc="center" p={"$2"} animateOnly={['backgroundColor']} animation="bouncy" br="$4" backgroundColor={isTabSelected(tabContent, shortedMatch) && !open ? (resolvedTheme == "dark" ? '$color2' : '$color4') : '$backgroundTransparent'}>
                                        {!collapsed && <SizableText f={1} ml={"$2.5"} fontWeight="bold" size={"$5"}>{tab}</SizableText>}
                                        {/* @ts-ignore */}
                                        <Square animation="bouncy" rotate={open ? '180deg' : '0deg'}>
                                            {
                                                collapsed
                                                    ? <Minus color="$gray6" size={20} />
                                                    : <ChevronDown color={isTabSelected(tabContent, shortedMatch) && !open ? '$color8' : '$gray9'} size={20} />
                                            }
                                        </Square>
                                    </XStack>
                                )}
                            </Accordion.Trigger>
                            <Accordion.Content position="relative" backgroundColor={"$backgroundTransparent"} pt={'$0'} pb={"$2"} >
                                <Subtabs collapsed={collapsed} tabs={tabs} subtabs={tabContent} shortedMatch={shortedMatch}/>
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
            <ScrollView showsVerticalScrollIndicator={false} pl={"$0"} mt={"$8"} mah="calc( 100vh - 150px ) "><Tabs tabs={workspace.menu} collapsed={collapsed} /></ScrollView>
        </Tinted>

    </YStack>)
}