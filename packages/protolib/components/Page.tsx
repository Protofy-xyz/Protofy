import React, { useEffect } from "react";
import { StackProps, YStack, useTheme } from "@my/ui";
import { useIsEditing } from "../visualui/useIsEditing"
import Head from 'next/head'
import { useSession, useSessionContext, getSessionContext } from "../lib/useSession";
import { getLogger } from "protobase";

export const Page = React.forwardRef(({mqttConfig, title, skipSessionManagement, ...props}: {mqttConfig?: any, title?: string, skipSessionManagement?: boolean} & StackProps, ref: any) => {
    const theme = useTheme()
    const isEditing = useIsEditing()

    const [ctx, setCtx] = useSessionContext()

    if(!skipSessionManagement) {
        const [session] = useSession()
        const loadContext = async() => {
            try {
                const currentContext = await getSessionContext(session.user.type)
                setCtx(currentContext)
            } catch(e) {
                getLogger().error({error: e}, "Error loading context")
            }
        }
        
        useEffect(() => {
            if(session.token && (!ctx || ctx.state == 'pending')) {
                loadContext()
            }
        }, [session, ctx])
    }

    return (
        <>
            {title && <Head>
            <title>{title}</title>
            </Head>}
            <YStack id={"protolib-page-container"} $xs={{paddingHorizontal: '$2'}} ref={ref} flex={1} height={"100%"} style={{overflowX:"hidden", ...(isEditing?{backgroundColor: theme.color1.val}:{})}} {...props}>
                {props.children}
            </YStack>
        </>
    );
});

export default Page;