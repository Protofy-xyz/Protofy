export const SiteConfig = {
    trackingID: 'G-XXXXXXXXXXXX',
    SSR: true //Server-side rendering
}

//helper function for pages
export const SSR = (fn:any) => SiteConfig.SSR ? fn : () => {return {props:{}}}