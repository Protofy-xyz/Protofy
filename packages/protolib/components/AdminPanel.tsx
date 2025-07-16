import { XStack } from '@my/ui'
import { SelectList } from './SelectList';
import { useWorkspaces, useUserSettings } from '../lib/useSession';
import { PanelMenu } from './PanelMenu';
import { MainPanel } from './MainPanel';
import { InteractiveIcon } from './InteractiveIcon'
import { Activity, Cog, Globe, Store } from '@tamagui/lucide-icons'
import { atom, useAtom } from 'jotai';
import { useContext, useEffect, useState } from 'react'
import { atomWithStorage } from 'jotai/utils'
import { LogPanel } from './LogPanel'
import { API } from 'protobase'
import useSubscription from '../lib/mqtt/useSubscription'
import { AppConfContext, SiteConfigType } from "../providers/AppConf"
import { useWorkspace } from '../lib/useWorkspace';
import { isElectron } from '../lib/isElectron'

const WorkspaceSelector = () => {
  const workspaces = useWorkspaces()
  const [settings, setSettings] = useUserSettings()

  return settings.workspace ? <SelectList
    triggerProps={{ o: 0.8, bc: "transparent", bw: 0 }}
    valueProps={{ o: 0.8 }}
    //@ts-ignore
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
  const userSpaces = useWorkspaces()
  const [appState, setAppState] = useAtom(AppState)
  const SiteConfig = useContext<SiteConfigType>(AppConfContext);
  const { PanelLayout } = SiteConfig.layout

  const [rightPanelSize, setRightPanelSize] = useAtom(RightPanelAtom)

  const { message } = useSubscription('notifications/object/#')

  const [boards, setBoards] = useState()
  const [objects, setObjects] = useState()

  const getObjects = async () => {
    const objects = await API.get('/api/core/v1/objects')
    if (objects.isLoaded) {
      setObjects(objects.data.items)
    }
  }

  const getBoards = async () => {
    const boards = await API.get('/api/core/v1/boards')
    if (boards.isLoaded) {
      setBoards(boards.data.items)
    }
  }

  useEffect(() => {
    getBoards()
    getObjects()
  }, [message])

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

  const workspaceData = useWorkspace({ boards: boards, objects: objects })
  const settingsLogs = workspaceData?.logs
  const settingsLogsEnabled = settingsLogs === undefined ? true : settingsLogs

  // console.log('userSpaces: ', userSpaces, 'current Workspace: ', currentWorkspace)
  return rightPanelSize && <MainPanel
    borderLess={true}
    rightPanelSize={rightPanelSize}
    setRightPanelSize={setRightPanelSize}
    rightPanelStyle={{ marginRight: '20px', height: '100vh', padding: '20px', backgroundColor: 'var(--bgPanel)' }}
    rightPanelVisible={settingsLogsEnabled && appState.logsPanelOpened}
    rightPanelResizable={true}
    centerPanelContent={workspaceData && <PanelLayout
      menuContent={<PanelMenu workspace={workspaceData} />}
    >
      <XStack f={1} px={"$0"} flexWrap='wrap'>
        {children}
      </XStack>
    </PanelLayout>
    } rightPanelContent={settingsLogsEnabled ? <LogPanel AppState={AppState} /> : null} />
}