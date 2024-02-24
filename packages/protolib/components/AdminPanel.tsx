import { XStack, YStack, Text, ScrollView, Theme, Popover, Input } from 'tamagui'
import { PanelLayout } from 'app/layout/PanelLayout'
import { SelectList, useWorkspaces, useUserSettings, useSession, PanelMenu, MainPanel, JSONViewer, useTint, Chip, ActiveGroup, GroupButton, ButtonGroup, Search } from 'protolib'
import Workspaces from 'app/bundles/workspaces'
import { InteractiveIcon } from './InteractiveIcon'
import { Activity, Radio, Tag, Hash, Microscope, Bug, Info, AlertCircle, XCircle, Bomb, Filter } from '@tamagui/lucide-icons'
import { Tinted } from './Tinted'
import { atom, useAtom } from 'jotai';
import { useEffect, useState } from 'react'
import { useSubscription } from 'mqtt-react-hooks'
import { useUpdateEffect } from 'usehooks-ts'
import { atomWithStorage } from 'jotai/utils'
import React from 'react'
const menuData = {}

const WorkspaceSelector = () => {
  const workspaces = useWorkspaces()
  const [settings, setSettings] = useUserSettings()

  return settings.workspace ? <SelectList
    triggerProps={{ o: 0.8, bc: "transparent", bw: 0 }}
    valueProps={{ o: 0.8 }}
    f={1}
    title={"workspaces"}
    value={settings.workspace}
    elements={workspaces}
    setValue={(v) => { setSettings({ ...settings, workspace: v }) }}
  /> : null
}

const initialLevels = ['info', 'warn', 'error', 'fatal']

export const AppState = atomWithStorage("adminPanelAppState", {
  logsPanelOpened: false,
  levels: initialLevels
})

export const RightPanelAtom = atom(20)
export const BusMessages = atom([])

const types = {
  10: { name: "TRACE", color: "$green3" },
  20: { name: "DEBUG", color: "$color4" },
  30: { name: "INFO", color: "$color7" },
  40: { name: "WARN", color: "$yellow7" },
  50: { name: "ERROR", color: "$red7" },
  60: { name: "FATAL", color: "$red10" }
}

const MessageList = ({ data, topic }) => {
  const from = topic.split("/")[1]
  const type = topic.split("/")[2]

  return <XStack p="$3" ml={"$0"} ai="center" jc="center">
    <YStack>
      <XStack left={-6} hoverStyle={{ bc: "$color6" }} cursor="pointer" ai="center" mb="$2" py={3} px="$2" width="fit-content" ml={"$3"}>
        <XStack ai="center" hoverStyle={{ o: 1 }} o={0.9}>
          {/* <Chip text={types[type]?.name+"("+topic+")"} color={types[type]?.color} h={25} /> */}
          <Chip text={types[type]?.name} color={types[type]?.color} h={25} />
          <Text ml={"$3"} o={0.9} fontSize={14} fontWeight={"500"}>{from}</Text>
        </XStack>
      </XStack>
      <XStack left={-6} hoverStyle={{ bc: "$color6" }} cursor="pointer" ai="center" mb="$2" py={3} px="$2" width="fit-content" ml={"$3"}>
        <XStack ai="center" hoverStyle={{ o: 1 }} o={0.9}>
          <Hash color="var(--color7)" strokeWidth={2} size={20} />
          <Text ml={"$2"} o={0.9} fontSize={14} fontWeight={"500"}>{data.msg}</Text>
        </XStack>
      </XStack>
      <JSONViewer
        onChange={() => { }}
        editable={false}
        data={data}
        key={JSON.stringify(data)}
        collapsible
        compact={false}
        defaultCollapsed={true}
      //collapsedNodes={{0:{root: true}}}
      />
    </YStack>
  </XStack>
}

export const LogPanel = () => {
  const [appState, setAppState] = useAtom(AppState)
  const maxLog = 1000
  const { topic, client, message } = useSubscription('logs/#');
  const [messages, setMessages] = useAtom(BusMessages)
  const [filteredMessages, setFilteredMessages] = useState([])
  const [search, setSearch] = useState('')

  useUpdateEffect(() => {
    // console.log('message: ', message)
    if (message) {

      //@ts-ignore
      setMessages([message, ...messages.slice(0, maxLog)])
    }
  }, [message])

  useEffect(() => {
    setFilteredMessages(messages.filter((m:any) => {
      const topic = m?.topic
      const from = topic.split("/")[1]
      //@ts-ignore
      const type = types[topic.split("/")[2]]
      return type && JSON.stringify(m).toLowerCase().includes(search.toLocaleLowerCase()) && appState.levels.includes(type.name.toLocaleLowerCase())
    }))
  }, [search, messages, appState.levels])

  useEffect(() => {
    if (!appState.levels) {
      setAppState({ ...appState, levels: initialLevels })
    }
  }, [appState.levels])

  const { tint } = useTint()

  const parseMessage = (msg: any) => {
    let parsed;
    try {
      parsed = JSON.parse(msg)
    } catch (e) {
      parsed = msg + ""
    }
    return parsed
  }

  const toggleLevel = (level: string) => {
    const { levels } = appState;

    setAppState({
      ...appState,
      levels: levels.includes(level) ? levels.filter(l => l !== level) : [...levels, level],
    });
  };

  return <YStack>
    <XStack ai="center">
      <Input
        focusStyle={{ borderLeftWidth: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomWidth: 1, outlineWidth: 0 }}
        borderBottomWidth={1}
        forceStyle='focus'
        br={0}
        // backgroundColor={'transparent'}
        value={search}
        width={"100%"}
        onChangeText={(text) => {
          setSearch(text);
        }}
        placeholder='Filter logs...'
        bw={0}
        paddingLeft={40}
      />
      <Popover placement="bottom-start">
        <Popover.Trigger position='absolute'>
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

    <ScrollView bc="transparent" f={1}>
      {filteredMessages.map((m, i) => {
        const data = parseMessage(m.message)
        return <XStack bc="transparent" hoverStyle={{ bc: "$" + tint + "4" }} key={i} btw={0} bbw={1} boc={"$color4"}>
          <Tinted>
            <MessageList data={data} topic={m.topic} />
          </Tinted>
        </XStack>
      })}
    </ScrollView>
  </YStack>
}

export const AdminPanel = ({ children }) => {
  const [settings] = useUserSettings()
  const userSpaces = useWorkspaces()
  const [appState, setAppState] = useAtom(AppState)
  const [rightPanelSize, setRightPanelSize] = useAtom(RightPanelAtom)
  const currentWorkspace = settings && settings.workspace ? settings.workspace : userSpaces[0]

  const getRightWidth = () => {
    const totalWidth = Math.max(400, window.innerWidth)
    let percentage = (400 / totalWidth) * 100;
    return percentage;
  }

  useEffect(() => {
    if (!rightPanelSize) {
      setRightPanelSize(getRightWidth())
    }
  }, [rightPanelSize])


  // console.log('userSpaces: ', userSpaces, 'current Workspace: ', currentWorkspace)
  return rightPanelSize && <MainPanel borderLess={true} rightPanelSize={rightPanelSize} setRightPanelSize={setRightPanelSize} rightPanelStyle={{ marginRight: '20px', height: 'calc(100vh - 85px)', marginTop: '68px', backgroundColor: 'transparent' }} rightPanelVisible={appState.logsPanelOpened} rightPanelResizable={true} centerPanelContent={Workspaces[currentWorkspace]
    ? <PanelLayout
      topBar={
        <>
          <XStack ai="center">
            <XStack>{userSpaces.length > 1 && <WorkspaceSelector />}</XStack>
            <InteractiveIcon onPress={() => setAppState({ ...appState, logsPanelOpened: !appState.logsPanelOpened })} IconColor="var(--color)" Icon={Activity}></InteractiveIcon>
          </XStack>
        </>
      }
      menuContent={<PanelMenu workspace={Workspaces[currentWorkspace]} />}
    >
      <XStack f={1} px={"$0"} flexWrap='wrap'>
        {children}
      </XStack>
    </PanelLayout>
    : <></>
  } rightPanelContent={<LogPanel />} />
}