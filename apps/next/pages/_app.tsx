import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'
import '../app.css'
import 'raf/polyfill'
import 'reactflow/dist/style.css'
import 'protoflow/src/styles.css'
import 'protoflow/src/diagram/menu.module.css'
import 'react-sliding-side-panel/lib/index.css'
import 'protolib/styles/datatable.css';
import '../chonky.css'
import 'react-dropzone-uploader/dist/styles.css'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { Provider } from 'app/provider'
import Head from 'next/head'
import React, { createContext } from 'react'
import type { SolitoAppProps } from 'solito'
import { SiteConfig } from 'app/conf'
import {AppConfContext} from 'app/provider/AppConf'
import { Provider as JotaiProvider } from 'jotai'

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css')
}

function MyApp({ Component, pageProps }: SolitoAppProps) {
  return (
    <>
      <Head>
        <title>Protofy Starter</title>
        <meta name="description" content="Protofy Starter" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <ThemeProvider>
        <JotaiProvider>
          <AppConfContext.Provider value={SiteConfig}>
            <Component {...pageProps} />
          </AppConfContext.Provider>
        </JotaiProvider>
      </ThemeProvider>
    </>
  )
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useRootTheme()

  return (
    <NextThemeProvider
      onChangeTheme={(next) => {
        setTheme(next as any)
      }}
    >
      <Provider disableRootThemeClass defaultTheme={theme}>
        {children}
      </Provider>
    </NextThemeProvider>
  )
}

export default MyApp
