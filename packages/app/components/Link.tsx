import {AppConfContext} from 'protolib/dist/providers/AppConf'
import {Link as ProtoLink, LinkProps} from 'protolib/dist/components/Link'
import {useContext} from 'react'

export const Link = (props:LinkProps) => {
    const SiteConfig = useContext(AppConfContext);
    return <ProtoLink {...props} SSR={SiteConfig.SSR} >{props.children}</ProtoLink>
}