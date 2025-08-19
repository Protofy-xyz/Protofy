
import { XStack, YStack, Text, ScrollView, Popover, Input } from '@my/ui'
import { JSONViewer } from './jsonui'
import {JSONView} from './JSONView'
import { useTint } from '../lib/Tints'
import { GroupButton } from './GroupButton'
import { ButtonGroup } from './ButtonGroup'
import { InteractiveIcon } from './InteractiveIcon'
import { Ban, Microscope, Bug, Info, AlertCircle, XCircle, Bomb, Filter } from '@tamagui/lucide-icons'
import { Tinted } from './Tinted'
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react'
import React from 'react'
import { useSubscription } from '../lib/mqtt'


const types = {
    10: { name: "TRACE", color: "$green3", icon: Microscope },
    20: { name: "DEBUG", color: "$color4", icon: Bug },
    30: { name: "INFO", color: "$color7", icon: Info },
    40: { name: "WARN", color: "$yellow7", icon: AlertCircle },
    50: { name: "ERROR", color: "$red7", icon: XCircle },
    60: { name: "FATAL", color: "$red10", icon: Bomb }
}

const MessageList = React.memo(({ data, topic }: any) => {
    const from = topic.split("/")[1]
    const type = topic.split("/")[2]
    const Icon = types[type]?.icon
    const message = JSON.parse(data)
    const { level, time, pid, hostname, msg, name, ...cleanData } = message
    return <XStack
        p="$3"
        ml={"$0"}
        ai="center"
        jc="center"
    >
        <YStack>
            <XStack left={-12} hoverStyle={{ bc: "$color6" }} cursor="pointer" ai="center" mb="$2" py={3} px="$2" width="fit-content" ml={"$3"}>
                <XStack ai="center" hoverStyle={{ o: 1 }} o={0.9}>
                    {/* <Chip text={types[type]?.name+"("+topic+")"} color={types[type]?.color} h={25} /> */}
                    <XStack mr={"$2"}><Icon size={20} strokeWidth={2} color={types[type]?.color} /></XStack>
                    {/* <Chip text={types[type]?.name} color={types[type]?.color} h={25} /> */}
                    <Text o={0.7} fontSize={14} fontWeight={"500"}>[{from}]</Text>
                    <Text ml={"$3"} o={0.9} fontSize={14} fontWeight={"500"}>{msg}</Text>
                </XStack>
            </XStack>
            <JSONView
                src={cleanData}
            />
        </YStack>
    </XStack>
})

const MAX_BUFFER_MSG = 10
export const LogPanel = ({AppState}) => {
    const [state, setAppState] = useAtom<any>(AppState)
    const appState: any = state

    const {messages, setMessages} = useSubscription('logs/#')

    const [bufferMsgs, setBufferMsgs] = useState([])
    const [filteredMessages, setFilteredMessages] = useState([])
    const [search, setSearch] = useState('')
    const initialLevels = ['info', 'warn', 'error', 'fatal']

    console.log('messages', messages)
    
    useEffect(() => {
        if(messages.length === 0) return
        //append new messages to the beginning of bufferMsgs
        //if bufferMsgs > MAX_BUFFER_MSG, remove from the bottom
        setBufferMsgs(prev => {
            const newBuffer = [...messages, ...prev]
            if (newBuffer.length > MAX_BUFFER_MSG) {
                return newBuffer.slice(0, MAX_BUFFER_MSG)
            }
            return newBuffer
        })
    }, [messages])

    useEffect(() => {
        setFilteredMessages(bufferMsgs.filter((m: any) => {
            console.log('message: ', m)
            const topic = m?.topic
            const from = topic.split("/")[1]
            //@ts-ignore
            const type = types[topic.split("/")[2]]
            console.log('result: ', type && (!search || JSON.stringify(m).toLowerCase().includes(search.toLocaleLowerCase())) && appState.levels.includes(type.name.toLocaleLowerCase()))
            return type && (!search || JSON.stringify(m).toLowerCase().includes(search.toLocaleLowerCase())) && appState.levels.includes(type.name.toLocaleLowerCase())
        }))
    }, [search, bufferMsgs, appState.levels])

    useEffect(() => {
        if (!appState.levels) {
            setAppState({ ...appState, levels: initialLevels })
        }
    }, [appState.levels])

    const { tint } = useTint()

    const toggleLevel = (level: string) => {
        const { levels } = appState;

        setAppState({
            ...appState,
            levels: levels.includes(level) ? levels.filter(l => l !== level) : [...levels, level],
        });
    };
    const hoverStyle = React.useMemo(() => ({ bc: "$" + tint + "4" }), [tint]);

    return <YStack f={1}>
        <XStack ai="center" backgroundColor={'$backgroundTransparent'}>
            <Input
                focusStyle={{ borderLeftWidth: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomWidth: 1, outlineWidth: 0 }}
                borderBottomWidth={1}
                forceStyle='focus'
                br={0}
                backgroundColor={'$backgroundTransparent'}
                value={search}
                width={"100%"}
                onChangeText={(text) => {
                    setSearch(text);
                }}
                placeholder='Filter logs...'
                bw={0}
                paddingLeft={80}
            />
            <Popover placement="bottom-start">
                <Popover.Trigger position='absolute'>
                    <InteractiveIcon size={20} Icon={Ban} onPress={() => setBufferMsgs([])} />
                </Popover.Trigger>
            </Popover>
            <Popover placement="bottom-start">
                <Popover.Trigger position='absolute' left={35}>
                    <InteractiveIcon size={20} Icon={Filter} />
                </Popover.Trigger>
                <Popover.Content padding={0} space={0} bw={1} boc="$borderColor" bc={"$color1"} >
                    <ButtonGroup mode="vertical">
                        <GroupButton onPress={() => toggleLevel('trace')} jc="flex-start" inActive={!appState.levels || !appState.levels.includes('trace')}>
                            <Microscope size="$1" strokeWidth={1} />
                            <Text>Trace</Text>
                        </GroupButton>
                        <GroupButton onPress={() => toggleLevel('debug')} jc="flex-start" inActive={!appState.levels || !appState.levels.includes('debug')}>
                            <Bug size="$1" strokeWidth={1} />
                            <Text>Debug</Text>
                        </GroupButton>
                        <GroupButton onPress={() => toggleLevel('info')} jc="flex-start" inActive={!appState.levels || !appState.levels.includes('info')}>
                            <Info size="$1" strokeWidth={1} />
                            <Text>Info</Text>
                        </GroupButton>
                        <GroupButton onPress={() => toggleLevel('warn')} jc="flex-start" inActive={!appState.levels || !appState.levels.includes('warn')}>
                            <AlertCircle size="$1" strokeWidth={1} />
                            <Text>Warn</Text>
                        </GroupButton>
                        <GroupButton onPress={() => toggleLevel('error')} jc="flex-start" inActive={!appState.levels || !appState.levels.includes('error')}>
                            <XCircle size="$1" strokeWidth={1} />
                            <Text>Error</Text>
                        </GroupButton>
                        <GroupButton onPress={() => toggleLevel('fatal')} jc="flex-start" inActive={!appState.levels || !appState.levels.includes('fatal')}>
                            <Bomb size="$1" strokeWidth={1} />
                            <Text>Fatal</Text>
                        </GroupButton>
                    </ButtonGroup>
                </Popover.Content>
            </Popover>
        </XStack>

        <ScrollView bc="transparent" f={1} height={"calc( 100vh - 90px )"}>
            {filteredMessages.map((m, i) => {
                return <XStack bc="transparent" hoverStyle={hoverStyle} key={i} btw={0} bbw={1} boc={"$color4"}>
                    <Tinted>
                        {/* @ts-ignore */}
                        <MessageList data={m.message} topic={m.topic} />
                    </Tinted>
                </XStack>
            })}
        </ScrollView>
    </YStack>
}