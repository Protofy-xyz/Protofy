import React, { useEffect } from "react";
import { StackProps, YStack, useTheme } from "tamagui";
import { useIsEditing } from "protolib"
import Head from 'next/head'
import { useSession, useSessionContext, useSessionGroup, useWorkspaces } from "../lib/Session";
import { useUpdateEffect } from "usehooks-ts";
import { getSessionContext } from "../api/lib/session";

export const Page = React.forwardRef(({mqttConfig, title, ...props}: {mqttConfig?: any, title?: string} & StackProps, ref: any) => {
    const theme = useTheme()
    const isEditing = useIsEditing()
    const [session] = useSession()
    const [ctx, setCtx] = useSessionContext()

    const loadContext = async() => {
        setCtx(await getSessionContext(session.user.type))
    }
    
    useEffect(() => {
        if(session.token && (!ctx || !ctx.group || !ctx.group['name'])) {
            loadContext()
        }
    }, [session, ctx])

    return (
        <>
            {title && <Head>
            <title>{title}</title>
            </Head>}
            <YStack id={"protolib-page-container"} ref={ref} flex={1} height={"100%"} style={{overflowX:"hidden", ...(isEditing?{backgroundColor: theme.color1.val}:{})}} {...props}>
                {props.children}
            </YStack>
        </>
    );
});

export default Page;