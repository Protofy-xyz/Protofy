import { createContext } from "react";

type SiteConfig = {
    trackingID: string,
    SSR: boolean
}

export const AppConfContext = createContext<SiteConfig>({
    trackingID: '',
    SSR: false
});
