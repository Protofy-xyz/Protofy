import { NextLink } from '../NextLink'
import * as React from 'react'
import {
  XStack,
} from '@my/ui'
import { isElectron } from '../../lib/isElectron'

export type HeaderContentsProps = {
  logoSize?: number,
  menu?: any,
  centerArea?: string,
  logo?: any
  logoHref?: string,
  leftArea?: any,
  rightArea?: any,
  topBar?: any
}

export const HeaderContents = React.memo(({ leftArea, centerArea, rightArea, logo, logoHref = "/", logoSize = 30, menu }: HeaderContentsProps) => {

  const [showMenu, setShowMenu] = React.useState(false)
  React.useEffect(() => {
    if (!isElectron()) {
      setShowMenu(true)
    }
  }, []);
  return (
    <XStack f={1} pt="$3" >
      <XStack ai="center" space="$4">
        {logo &&
          <XStack f={1} minWidth={210} $xs={{ paddingLeft: "$4" }}>
            {logo && <NextLink href={logoHref}>
              <XStack py={logoSize / 4} ai="center" px="$3" cur="pointer" my={-20}>
                {logo}
              </XStack>
            </NextLink>}
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
        jc="center"
        fullscreen
        pointerEvents="none"
        ai="center"
      >
        {centerArea}
      </XStack>}

      <XStack
        marginLeft="auto"
        jc="center"
        h={40}
        miw={160}
        $xs={{ miw: 130 }}
        pointerEvents="auto"
        tag="nav"
        marginRight="$3"
      >
        <XStack ai="center" space="$3">
          {rightArea}
          {showMenu && menu}
        </XStack>
      </XStack>
    </XStack>
  )
})
