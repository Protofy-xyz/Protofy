import { ThemeToggle, GithubIcon, HeaderLink, NextLink, ColorToggleButton, LogoIcon, Session} from 'protolib'
import * as React from 'react'
import {
  Text,
  TooltipGroup,
  TooltipSimple,
  VisuallyHidden,
  XGroup,
  XStack,
  YStack,
} from 'tamagui'
import { HeaderMenuContent } from './HeaderMenuContent'
import { HeaderMenu } from './HeaderMenu'
import { useAtom } from 'jotai'

type HeaderContentsProps = {
  logoSize?: number,
  menuPlacement?: 'top' | 'bottom' | 'left' | 'right'
}
const tooltipDelay = { open: 500, close: 150 }

export const HeaderContents = React.memo(({menuPlacement='bottom', logoSize=30}: HeaderContentsProps) => {
  const [session] = useAtom(Session)
  return (
    <>
      <XStack ai="center" space="$4">
          <NextLink href="/">
            <XStack py={logoSize/4} ai="center" px="$3" cur="pointer" my={-20}>
              <LogoIcon>
                {/* <ProtofyLogoSVG
                  className="tamagui-icon"
                  width={logoSize}
                  height={logoSize+(logoSize/11)}
                /> */}
              </LogoIcon>
              <Text>Protofy</Text>
            </XStack>
          </NextLink>
        

        <TooltipGroup delay={tooltipDelay}>
          <XGroup boc="$color2" bw={1} mah={32} bc="transparent" ai="center" size="$3">
            <XGroup.Item>
              <ThemeToggle borderWidth={0} chromeless />
            </XGroup.Item>
            <XGroup.Item>
              <ColorToggleButton borderWidth={0} chromeless />
            </XGroup.Item>
          </XGroup>
        </TooltipGroup>
      </XStack>

      <XStack
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
        {/* <NextLink href="/" aria-label="Homepage">
          <XStack
            cursor={isHome ? 'default' : 'pointer'}
            pointerEvents="auto"
            als="center"
          >
            <Logo text="Protofy" animated />
          </XStack>
        </NextLink> */}
      </XStack>

      {/*  prevent layout shift */}
      <XStack
        h={40}
        jc="flex-end"
        miw={160}
        $xs={{ miw: 130 }}
        pointerEvents="auto"
        tag="nav"
        marginRight="$3"
      >
        <XStack ai="center" space="$3">
            {session.loggedIn?<HeaderLink href="/profile">{session.user.id}</HeaderLink>:<HeaderLink href="/auth/login">Login</HeaderLink>}
          <HeaderMenu menuPlacement={menuPlacement}>
            <HeaderMenuContent />
          </HeaderMenu>
        </XStack>
      </XStack>
    </>
  )
})
