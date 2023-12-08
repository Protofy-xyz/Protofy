import Head from 'next/head'
import { NextPageContext } from 'next'
import { useSession, withSession, SSR } from 'protolib'
import theme from 'visualui/src/components/Theme'

import { useEditorStore } from 'visualui/src/store/EditorStore';
import { RenderNode } from 'visualui/src/components/RenderNode';
import paletteComponents from 'visualui/src/palettes';
import EditorLayout from "visualui/src/components/EditorLayout";
import { Sidebar } from "visualui/src/components/Sidebar";
import MainPanel from "visualui/src/components/MainPanel";
import Monaco from "visualui/src/components/Monaco";
import { getMissingJsxImports, getSource } from "visualui/src/utils/utils";
import { withTopics } from "react-topics";
import { ToggleGroup, Button, XStack } from "@my/ui"
import UIMasks from 'visualui/src/masks/UI.mask.json';
import { SidebarItem } from "visualui/src/components/Sidebar/SideBarItem";
import dynamic from 'next/dynamic';
import { useThemeSetting } from '@tamagui/next-theme';
const FlowsWidget = dynamic(() => import('protolib/adminpanel/features/components/FlowsWidget'), {
  loading: () => <>
    Loading
  </>,
  ssr: false
})

export default function ProfilePage(props: any) {
    return (
        <>
            <Head>
                <title>Protofy - Profile</title>
            </Head>
            <XStack height="100vh" width="100vw">
                <FlowsWidget sourceCode={"// this is a test"}/>
            </XStack>

        </>
    )
    }

export const getServerSideProps = SSR(async (context: NextPageContext) => withSession(context, []))