import { AppConfContext, SiteConfigType } from "../providers/AppConf"
import { useUserSettings, useWorkspaces } from "./useSession"
import { useContext } from 'react'

export const useWorkspace = (props?:{boards?: string[], objects?: []}) => {
    const {boards, objects} = props ?? {}
    const SiteConfig = useContext<SiteConfigType>(AppConfContext);
    const { workspaces } = SiteConfig.bundles
    const [settings] = useUserSettings()
    const userSpaces = useWorkspaces()
    const currentWorkspace = settings && settings.workspace ? settings.workspace : userSpaces[0]
    return typeof workspaces[currentWorkspace] === 'function' ? workspaces[currentWorkspace]({ boards: boards ?? [], objects: objects ?? [] }) : workspaces[currentWorkspace]
}
