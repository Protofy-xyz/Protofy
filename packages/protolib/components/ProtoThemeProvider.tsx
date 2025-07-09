import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { Provider } from 'app/provider'
import React from 'react'
import { Toast, YStack } from '@my/ui'
import { SiteConfig } from 'app/conf'


export function ProtoThemeProvider({ children, forcedTheme }: { forcedTheme: string, children: React.ReactNode }) {
  const [theme, setTheme] = useRootTheme()

//   if (typeof window !== 'undefined') {
//     window.TamaguiTheme = theme
//   }

  return (
    <NextThemeProvider
      forcedTheme={forcedTheme}
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