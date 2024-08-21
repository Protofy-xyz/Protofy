import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'
import "mapbox-gl/dist/mapbox-gl.css"
import '../app.css'
import 'raf/polyfill'
import 'reactflow/dist/style.css'
import 'protoflow/src/styles.css'
import 'protoflow/src/diagram/menu.module.css'
import 'react-sliding-side-panel/lib/index.css'
import 'protolib/styles/datatable.css';
import 'protolib/styles/styles.css';
import '../chat.css'
import '../map.css'
import '../chonky.css'
import '../dashboard.css'
import "@blueprintjs/table/lib/css/table.css";
import '../blueprint.css'
import 'react-dropzone-uploader/dist/styles.css'
import 'react-chat-widget/lib/styles.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { setConfig, initSchemaSystem } from 'protobase';
import { getBaseConfig } from '@my/config'
setConfig(getBaseConfig("next", process))
import { Provider } from 'app/provider'
import Head from 'next/head'
import React from 'react'
import type { SolitoAppProps } from 'solito'
import { AppConfig } from '../conf'
import { Provider as JotaiProvider } from 'jotai'
import { useSession } from 'protolib/lib/Session'
import { AppConfContext } from 'protolib/providers/AppConf'
import { getBrokerUrl } from 'protolib/lib/Broker'
import { Connector } from 'protolib/lib/mqtt'
import { Toast, YStack } from '@my/ui'
import { SiteConfig } from 'app/conf'
import { getFlowMasks, getFlowsCustomComponents } from "app/bundles/masks"
import { getFlowsCustomSnippets } from "app/bundles/snippets"
import { palettes } from 'app/bundles/palettes'
import Workspaces from 'app/bundles/workspaces'
import { PanelLayout } from 'app/layout/PanelLayout'

initSchemaSystem()

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css')
}

function MyApp({ Component, pageProps }: SolitoAppProps) {
  //@ts-ignore
  const [session] = useSession(pageProps['pageSession'])
  const projectName = SiteConfig.projectName

  const isElectron = () => {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
      return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
      return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
      return true;
    }

    return false;
  }

  const brokerUrl = getBrokerUrl()

  console.log('brokerUrl', brokerUrl)
  return (
    <>
      <Head>
        <title>{projectName + " - AI Supercharged LowCode Platform CMS and Framework"}</title>
        <meta name="description" content="Next Generation Development Platform for web, mobile and IoT. Based on proven tech: React, ChatGPT, ESPHome, Express, Next, Node, Tamagui, Zod, LevelDB an much more." />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <JotaiProvider>
        <Connector brokerUrl={brokerUrl} options={{ username: session?.user?.id, password: session?.token }}>
          <ThemeProvider>
            <AppConfContext.Provider value={{
              ...AppConfig,
              bundles: {
                masks: { getFlowMasks, getFlowsCustomComponents },
                snippets: { getFlowsCustomSnippets },
                palettes,
                workspaces: Workspaces,
              },
              layout: {
                PanelLayout
              }
            }}>
              <Component {...pageProps} />
            </AppConfContext.Provider>
          </ThemeProvider>
        </Connector>
      </JotaiProvider>
    </>
  )
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useRootTheme()

  const isDev = process.env.NODE_ENV === 'development'

  return (
    <NextThemeProvider
      onChangeTheme={(next) => {
        setTheme(next as any)
      }}
    >
      <Provider disableRootThemeClass defaultTheme={theme}>
        {children}

        {isDev && <Toast
          viewportName="warnings"
          enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
          exitStyle={{ opacity: 0, scale: 1, y: -20 }}
          y={0}
          opacity={1}
          scale={1}
          duration={9999999999}
          animation="100ms"
        >
          <YStack>
            <Toast.Title>Preview Mode</Toast.Title>
            <Toast.Description>This page is in preview/development mode. This may affect your user experience and negatively impact the performance.</Toast.Description>
          </YStack>
        </Toast>}
      </Provider>
    </NextThemeProvider>
  )
}

export default MyApp
