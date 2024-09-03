import { createContext } from "react";


//SiteconfigTYpe is for things like:
/*
    trackingID: 'G-XXXXXXXXXXXX',
    SSR: true, //Server-side rendering
    getDevelopmentURL: (path, protocol?, host?) => _host && _protocol ? (protocol??_protocol)+`//${(host??_host)}:8000${path}`: path,
    getProductionURL: (path, protocol?, host?) => _host && _protocol ? (protocol??_protocol)+`//${(host??_host)}:8080${path}` : path,
    useLocalDocumentation: false,
    signupEnabled: false,
    defaultWorkspace: 'dev',
    defaultWorkspacePage: 'pages',
*/

export type SiteConfigType = {
    trackingID: string,
    SSR: boolean,
    getDevelopmentURL: (path: string, protocol?: string, host?: string) => string,
    getProductionURL: (path: string, protocol?: string, host?: string) => string,
    useLocalDocumentation: boolean,
    signupEnabled: boolean,
    defaultWorkspace: string,
    defaultWorkspacePage: string,
    assistant: boolean,
    projectName: string,
    bundles: {
        flowsMenu: {
            getFlowsMenuConfig: (path: string, queryParams: {}) => any,
        },
        masks: {
            getFlowsCustomComponents: (path: string, queryParams: {}) => any[],
            getFlowMasks: (path: string, queryParams: {}) => any[]
        },
        snippets: {
            getFlowsCustomSnippets: (path: string, queryParams: {}) => any[]
        },
        palettes: any,
        workspaces: any
    },
    layout: {
        PanelLayout: React.FC,
    }
}

export const AppConfContext = createContext<SiteConfigType>({
    trackingID: '',
    SSR: false,
    getDevelopmentURL: (path: string, protocol?: string, host?: string) => '',
    getProductionURL: (path: string, protocol?: string, host?: string) => '',
    useLocalDocumentation: false,
    signupEnabled: false,
    defaultWorkspace: 'dev',
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
