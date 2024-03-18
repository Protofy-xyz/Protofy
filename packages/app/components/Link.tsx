import {Link as ProtoLink, LinkProps, AppConfContext} from 'protolib'
import {useContext} from 'react'

export const Link = (props:LinkProps) => {
    const SiteConfig = useContext(AppConfContext);
    return <ProtoLink {...props} SSR={SiteConfig.SSR} >{props.children}</ProtoLink>
}