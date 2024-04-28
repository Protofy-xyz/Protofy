import { XStack } from 'tamagui'
import { PanelLayout } from 'app/layout/PanelLayout'
import { SelectList, useWorkspaces, useUserSettings, PanelMenu, MainPanel } from 'protolib'
import Workspaces from 'app/bundles/workspaces'
import { InteractiveIcon } from './InteractiveIcon'
import { Activity } from '@tamagui/lucide-icons'
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react'
import { atomWithStorage } from 'jotai/utils'
import {LogPanel} from './LogPanel'

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
  } rightPanelContent={<LogPanel AppState={AppState} />} />
}