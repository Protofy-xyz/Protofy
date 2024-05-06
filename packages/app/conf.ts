const SiteConfig = {
    trackingID: 'G-XXXXXXXXXXXX',
    SSR: true, //Server-side rendering
    workspaceRoot: '/workspace',
    getDevelopmentURL: (path, protocol='http:', host='localhost') => protocol+`//${host}:8000${path}`,
    useLocalDocumentation: false
}
export {SiteConfig}