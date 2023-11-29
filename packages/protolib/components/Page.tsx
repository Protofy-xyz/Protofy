import React from "react";
import { StackProps, YStack, useTheme } from "tamagui";
import { useIsEditing } from "protolib"
import Head from 'next/head'

export const Page = React.forwardRef(({mqttConfig, title, ...props}: {mqttConfig?: any, title?: string} & StackProps, ref: any) => {
    const theme = useTheme()
    const isEditing = useIsEditing()

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