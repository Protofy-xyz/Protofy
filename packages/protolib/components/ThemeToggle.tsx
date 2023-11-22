import { Monitor, Moon, Sun } from '@tamagui/lucide-icons'
import { useThemeSetting } from '@tamagui/next-theme'
import React from 'react'
import { useState } from 'react'
import { Button, ButtonProps, Stack, TooltipSimple, useIsomorphicLayoutEffect } from 'tamagui'

const icons = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}

export const ThemeToggle = React.forwardRef((props: ButtonProps, ref: any) => {
  const themeSetting = useThemeSetting()!
  const [clientTheme, setClientTheme] = useState<string>('light')

  useIsomorphicLayoutEffect(() => {
    setClientTheme(themeSetting.current || 'light')
  }, [themeSetting.current])

  const Icon = icons[clientTheme]

  return (
    <Stack ref={ref}>
      <TooltipSimple
        groupId="header-actions-theme"
        label={`Switch theme (${themeSetting.current})`}
      >
        <Button
          size="$3"
          onPress={themeSetting.toggle}
          {...props}
          aria-label="Toggle light/dark color scheme"
          icon={Icon}
        >
          {/* {theme === 'light' ? <Moon size={12} /> : <SunIcon />} */}
        </Button>
      </TooltipSimple>
    </Stack>

  )
})
