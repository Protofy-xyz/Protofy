const _host = typeof window !== 'undefined' ? window.location.hostname : ''
const _protocol = typeof window !== 'undefined' ? window.location.protocol : ''

const SiteConfig = {
    trackingID: 'G-XXXXXXXXXXXX',
    SSR: true, //Server-side rendering
    getDevelopmentURL: (path, protocol?, host?) => _host && _protocol ? (protocol??_protocol)+`//${(host??_host)}:8000${path}`: path,
    getProductionURL: (path, protocol?, host?) => _host && _protocol ? (protocol??_protocol)+`//${(host??_host)}:8080${path}` : path,
    useLocalDocumentation: false,
    signupEnabled: false,
    defaultWorkspace: 'prod',
    defaultWorkspacePage: 'pages',
    assistant: true,
    ui: {
        tintSwitcher: true,
        themeSwitcher: true,
    }
}
export { SiteConfig }