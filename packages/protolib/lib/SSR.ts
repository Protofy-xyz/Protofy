//helper function for pages
import {SiteConfig} from 'app/conf'

export const SSR = (fn) => SiteConfig.SSR ? fn : () => {return {props:{}}}