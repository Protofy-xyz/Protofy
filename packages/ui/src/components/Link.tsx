import {Link as ProtoLink, LinkProps} from 'protolib'
import {useContext} from 'react'
import {AppConfContext} from 'app/provider/AppConf'

export const Link = (props:LinkProps) => {
    const SiteConfig = useContext(AppConfContext);
    return <ProtoLink {...props} SSR={SiteConfig.SSR} >{props.children}</ProtoLink>
}