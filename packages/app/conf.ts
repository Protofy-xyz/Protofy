export const SiteConfig = {
    trackingID: 'G-XXXXXXXXXXXX',
    SSR: true, //Server-side rendering,
    environments: [
        {
            name: 'development',
            address: 'http://localhost:8080'
        },
        {
            name: 'production',
            address: 'http://localhost:8000'
        }
    ]
}

//helper function for pages
export const SSR = (fn:any) => SiteConfig.SSR ? fn : () => {return {props:{}}}