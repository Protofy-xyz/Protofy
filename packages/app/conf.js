const SiteConfig = {
    trackingID: 'G-XXXXXXXXXXXX',
    SSR: true, //Server-side rendering,
    environments: [
        {
            name: 'development',
            api: 'http://localhost:3001',
            adminApi: 'http://localhost:3002'
        },
        // {
        //     name: 'production',
        //     api: 'http://localhost:4001',
        //     adminApi: 'http://localhost:4002'
        // }
    ]
}
export {SiteConfig}