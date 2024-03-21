import { createContext } from "react";

export type SiteConfigType = {
    trackingID: string,
    SSR: boolean,
    workspaceRoot: string
}

export const AppConfContext = createContext<SiteConfigType>({
    trackingID: '',
    SSR: false,
    workspaceRoot: '/workspace'
});
