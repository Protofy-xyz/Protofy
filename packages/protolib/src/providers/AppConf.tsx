import { createContext } from "react";


//SiteconfigTYpe is for things like:
/*
    trackingID: 'G-XXXXXXXXXXXX',
    SSR: true, //Server-side rendering
    useLocalDocumentation: false,
    signupEnabled: false,
    defaultWorkspacePage: 'pages',
*/

export type SiteConfigType = {
    trackingID: string,
    SSR: boolean,
    useLocalDocumentation: boolean,
    signupEnabled: boolean,
    defaultWorkspacePage: string,
    assistant: boolean,
    projectName: string,
    bundles: {
        workspaces: any
    },
    layout: {
        PanelLayout: React.FC,
    }
}

export const AppConfContext = createContext<SiteConfigType>({
    trackingID: '',
    SSR: false,
    useLocalDocumentation: false,
    signupEnabled: false,
    defaultWorkspacePage: 'events',
    assistant: true,
    projectName: 'Protofy',
    bundles: {
        flowsMenu: {
            getFlowsMenuConfig: (path: string, queryParams: {}) => {}
        },
        masks: {
            getFlowsCustomComponents: (path: string, queryParams: {}) => [],
            getFlowMasks: (path: string, queryParams: {}) => []
        },
        snippets: {
            getFlowsCustomSnippets: (path: string, queryParams: {}) => []
        },
        palettes: {},
        workspaces: {}
    },
    layout: {
        PanelLayout: () => <></>
    }
});
