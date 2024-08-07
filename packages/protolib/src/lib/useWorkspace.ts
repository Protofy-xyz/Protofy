import { AppConfContext, SiteConfigType } from "../providers/AppConf"
import { useUserSettings, useWorkspaces } from "./Session"
import { useContext } from 'react'

export const useWorkspace = (props?:{pages?:string[]}) => {
    const {pages} = props ?? {}
    const SiteConfig = useContext<SiteConfigType>(AppConfContext);
    const { workspaces } = SiteConfig.bundles
    const [settings] = useUserSettings()
    const userSpaces = useWorkspaces()
    const currentWorkspace = settings && settings.workspace ? settings.workspace : userSpaces[0]
    return typeof workspaces[currentWorkspace] === 'function' ? workspaces[currentWorkspace]({ pages: pages ?? [] }) : workspaces[currentWorkspace]
}
