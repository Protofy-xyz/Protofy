import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'
import dynamic from 'next/dynamic';
import { Stack } from 'tamagui';
import { useThemeSetting } from "@tamagui/next-theme";
import {YStack} from 'tamagui'

export default function Page(props: any) {
    //@ts-ignore
    const Chatbot = dynamic(() => import('protolib/components/chatbot'), { ssr: false })
    const projectName = SiteConfig.projectName

    return (
        <>
            <Head>
                <title>{projectName + " - Chatbot"}</title>
            </Head>
            <YStack backgroundColor="$bgContent" f={1}>
                <Chatbot />
            </YStack>
        </>
    )
}