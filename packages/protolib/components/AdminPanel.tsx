import { XStack, YStack, Text, ScrollView } from 'tamagui'
import { PanelLayout } from 'app/layout/PanelLayout'
import { SelectList, useWorkspaces, useUserSettings, useSession, PanelMenu, MainPanel, JSONViewer, useTint} from 'protolib'
import Workspaces from 'app/bundles/workspaces'
import { InteractiveIcon } from './InteractiveIcon'
import { Activity, Radio } from '@tamagui/lucide-icons'
import { Tinted } from './Tinted'
import { atom, useAtom } from 'jotai';
import { useEffect, useState } from 'react'
import { useSubscription } from 'mqtt-react-hooks'
import { useUpdateEffect } from 'usehooks-ts'
import { atomWithStorage } from 'jotai/utils'
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


export const AppState = atomWithStorage("adminPanelAppState", {
  logsPanelOpened: false
})

export const RightPanelAtom = atom(0)
export const BusMessages = atom([])

const MessageList = ({ data, topic }) => {
  return <XStack p="$3" ml={"$0"} ai="center" jc="center">
      {/* <YStack jc="center" mr="$4"><MessageSquare color="var(--color7)" strokeWidth={1} /></YStack> */}
      <YStack>
          <XStack left={-6} hoverStyle={{ bc: "$color6" }} cursor="pointer" ai="center" mb="$2" py={3} px="$2" br="$6" width="fit-content" ml={"$3"}>
              <XStack ai="center" hoverStyle={{ o: 1 }} o={0.9}>
                  <Radio color="var(--color7)" strokeWidth={2} size={20} />
                  <Text ml={"$2"} o={0.9} fontSize={14} fontWeight={"500"}>{topic}</Text>
              </XStack>
              {/* <Chip width="fit-content" text={m.topic} color={'$color5'} /> */}
          </XStack>
          {/* <Chip width="fit-content" text={m.topic} color={'$color5'} /> */}
          {/* <Text>{m.message}</Text> */}
          <JSONViewer
              onChange={() => { }}
              editable={false}
              data={data}
              key={JSON.stringify(data)}
              collapsible
              compact={false}
              defaultCollapsed={false}
          //collapsedNodes={{0:{root: true}}}
          />
      </YStack>
  </XStack>
}

export const LogPanel = () => {
  const maxLog = 199
  const { topic, client, message } = useSubscription('#');
  const [messages, setMessages] = useAtom(BusMessages)
  useUpdateEffect(() => {
    console.log('DOOOOOOOOOOOOOOOOOOOOOOOOO', message)
    setMessages([message, ...messages.slice(maxLog)])
  }, [message])

  const { tint } = useTint()

  const parseMessage = (msg) => {
    let parsed;
    try {
      parsed = JSON.parse(msg)
    } catch (e) {
      parsed = msg + ""
    }
    return parsed
  }

  return <ScrollView br="$6" bc="$background" f={1}>
                      {messages.map((m, i) => {
                        const data = parseMessage(m.message)
                        return <XStack bc="transparent" hoverStyle={{ bc: "$" + tint + "4" }} key={i} btw={0} borderTopLeftRadius={!i?"$6":"$0"} borderTopRightRadius={!i?"$6":"$0"} bbw={i<(messages.length-1) ? 1 : 0} boc={"$color4"}>
                            <Tinted>
                                <MessageList data={data} topic={m.topic} />
                            </Tinted>
                        </XStack>
                    })}
  </ScrollView>
}

export const AdminPanel = ({ children }) => {
  const [settings] = useUserSettings()
  const userSpaces = useWorkspaces()
  const [session, setSession] = useSession()
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
  return rightPanelSize && <MainPanel borderLess={true} rightPanelSize={rightPanelSize} setRightPanelSize={setRightPanelSize} rightPanelStyle={{ marginRight: '20px', height: 'calc(100vh - 85px)', marginTop: '66px' }} rightPanelVisible={appState.logsPanelOpened} rightPanelResizable={true} centerPanelContent={Workspaces[currentWorkspace]
    ? <PanelLayout
      topBar={
        <>
          <XStack ai="center">
            <XStack>{userSpaces.length > 1 && <WorkspaceSelector />}</XStack>
            {/* <InteractiveIcon onPress={() => setAppState({ ...appState, logsPanelOpened: !appState.logsPanelOpened })} IconColor="var(--color)" Icon={Activity}></InteractiveIcon> */}
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