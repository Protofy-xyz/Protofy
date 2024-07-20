import { ThemeToggle} from 'protolib/dist/components/ThemeToggle'
import { NextLink} from 'protolib/dist/components/NextLink'
import { ColorToggleButton} from 'protolib/dist/components/ColorToggleButton'
import * as React from 'react'
import {
  TooltipGroup,
  XGroup,
  XStack,
} from 'tamagui'
import { SiteConfig } from 'app/conf'

export type HeaderContentsProps = {
  logoSize?: number,
  menu?: any,
  centerArea?: string,
  logo?: any
  logoHref?: string,
  themeSwitcher?: boolean,
  tintSwitcher?: boolean,
  leftArea?: any,
  rightArea?: any,
  topBar?: any
}
const tooltipDelay = { open: 500, close: 150 }

export const HeaderContents = React.memo(({leftArea, centerArea,rightArea, logo, logoHref="/", themeSwitcher=true, tintSwitcher=true, logoSize=30, menu}: HeaderContentsProps) => {
  const settingsTintSwitcher = SiteConfig.ui?.tintSwitcher
  const settingsThemeSwitcher = SiteConfig.ui?.themeSwitcher

  const settingsTintSwitcherEnabled = settingsTintSwitcher === undefined ? true : settingsTintSwitcher
  const settingsThemeSwitcherEnabled = settingsTintSwitcher === undefined ? true : settingsThemeSwitcher
  return (
    <XStack flex={1} paddingTop="$3" >
      <XStack alignItems="center" space="$4">
        {(logo || themeSwitcher || tintSwitcher) &&
          <XStack flex={1} minWidth={210}>
            {logo && <NextLink href={logoHref}>
              <XStack paddingVertical={logoSize/4} alignItems="center" paddingHorizontal="$3" cursor="pointer" marginVertical={-20}>
                {logo}
              </XStack>
            </NextLink>}{(themeSwitcher || tintSwitcher) &&
              <TooltipGroup delay={tooltipDelay}>
                <XGroup borderColor="$color2" borderWidth={1} maxHeight={32} backgroundColor="transparent" alignItems="center" size="$3">
                  {themeSwitcher && settingsThemeSwitcherEnabled && <XGroup.Item>
                    <ThemeToggle borderWidth={0} chromeless />
                  </XGroup.Item>}
                  {tintSwitcher && settingsTintSwitcherEnabled && <XGroup.Item>
                    <ColorToggleButton borderWidth={0} chromeless />
                  </XGroup.Item> }
                </XGroup>
              </TooltipGroup>}
          </XStack>}
        {leftArea}
      </XStack>


      {centerArea && <XStack
        position="absolute"
        $sm={{
          opacity: 0,
          pointerEvents: 'none',
        }}
        zIndex={-1}
       justifyContent="center"
        fullscreen
        pointerEvents="none"
        alignItems="center"
      >
        {centerArea}
      </XStack>}

      <XStack
        marginLeft="auto"
       justifyContent="center"
        height={40}
        minWidth={160}
        $xs={{ minWidth: 130 }}
        pointerEvents="auto"
        tag="nav"
        marginRight="$3"
      >
        <XStack alignItems="center" space="$3">
          {rightArea}
          {menu}
        </XStack>
      </XStack>
    </XStack>
  )
})
