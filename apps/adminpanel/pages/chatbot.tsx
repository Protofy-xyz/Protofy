import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { SiteConfig } from 'app/conf'
import dynamic from 'next/dynamic'
import { YStack } from 'tamagui'
import { useRouter } from 'next/router'

export default function Page(props: any) {
    const { query } = useRouter()
    const apiUrl = query.apiUrl as string
    const Chatbot = dynamic(() => import('protolib/components/chatbot'), { ssr: false })
    const projectName = SiteConfig.projectName

    return (
        <>
            <Head>
                <title>{projectName + " - Chatbot"}</title>
            </Head>
            <YStack backgroundColor="$bgContent" f={1}>
                <Chatbot apiUrl={apiUrl} />
            </YStack>
        </>
    )
}
