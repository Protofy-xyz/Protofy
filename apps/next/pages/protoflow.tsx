import Head from 'next/head'
import { NextPageContext } from 'next'
import { useSession, withSession, SSR } from 'protolib'
import theme from 'visualui/src/components/Theme'

import { useEditorStore } from 'visualui/src/store/EditorStore';
import { ToggleGroup, Button, XStack } from "@my/ui"
import {Flows } from 'protolib/adminpanel/features/components/Flows';

export default function ProfilePage(props: any) {
    return (
        <>
            <Head>
                <title>Protofy - Profile</title>
            </Head>
            <XStack height="100vh" width="100vw">
                <Flows sourceCode={"// Test of sourcecode"}/>
            </XStack>

        </>
    )
    }

export const getServerSideProps = SSR(async (context: NextPageContext) => withSession(context, []))