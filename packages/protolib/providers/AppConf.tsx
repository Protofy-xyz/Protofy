import { createContext } from "react";

export type SiteConfigType = {
    trackingID: string,
    SSR: boolean
}

export const AppConfContext = createContext<SiteConfigType>({
    trackingID: '',
    SSR: false
});
