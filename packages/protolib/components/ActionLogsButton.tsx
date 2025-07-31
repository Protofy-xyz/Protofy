import { useAtom } from "jotai"
import { AppState } from "./AdminPanel"
import { isElectron } from "../lib/isElectron"
import { ActionBarButton } from "./ActionBarWidget"
import { Tinted } from "./Tinted"
import { Activity } from 'lucide-react'

export const ActionLogsButton = ({...props}) => {
  const [appState, setAppState] = useAtom(AppState)
  
  const onToggleLogs = () => {
    if (isElectron()) {
      window['electronAPI'].toggleLogWindow()
    } else {
      setAppState({ ...appState, logsPanelOpened: !appState.logsPanelOpened })
    }
  }
  
  return <Tinted>
    <ActionBarButton selected={appState.logsPanelOpened} Icon={Activity} onPress={onToggleLogs} {...props}/>
  </Tinted>
}