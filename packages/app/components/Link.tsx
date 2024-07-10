import {AppConfContext} from 'protolib/src/providers/AppConf'
import {Link as ProtoLink, LinkProps} from 'protolib'
import {useContext} from 'react'

export const Link = (props:LinkProps) => {
    const SiteConfig = useContext(AppConfContext);
    return <ProtoLink {...props} SSR={SiteConfig.SSR} >{props.children}</ProtoLink>
}