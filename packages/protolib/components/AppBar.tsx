import { ThemeTint, useTint } from 'protolib'
import * as React from 'react'
import {
  StackProps,
  XStack,
  YStack,
  isClient,
} from 'tamagui'

import { ContainerLarge } from './Container'

export type AppBarProps = {
  floating?: boolean,
  position?: "top" | "bottom",
  children?: any,
  translucid?: boolean,
  dettached?: boolean,
  menuPlacement?: 'top' | 'bottom' | 'left' | 'right',
  fullscreen?: boolean,
  height?: number | undefined,
  containerProps?: StackProps,
  backgroundColor?: string
}

export const AppBar = React.forwardRef(({ backgroundColor = "$background", containerProps = {}, height = undefined, fullscreen = false, translucid = true, dettached = true, position = 'top', ...props }: AppBarProps, ref: any) => {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const headerContainerRef = React.useRef(null)

  if (isClient) {
    React.useEffect(() => {
      const onScroll = () => {
        setIsScrolled(window.scrollY > 30)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onScroll)
      }
    }, [])
  }

  const getContent = () => (<XStack
      ref={ref}
      alignItems="center"
      tag="header"
      justifyContent="space-between"
      position="relative"
      paddingHorizontal={props.floating ? 0 : '$2'}
      zIndex={50000}
    >
      {React.useMemo(
        () => props.children,
        [props, translucid, position]
      )}
    </XStack>
)
  return (
    <>
      <XStack
        // @ts-ignore
        ref={headerContainerRef}
        pos="fixed"
        top={position == 'top' ? 0 : undefined}
        bottom={position == 'bottom' ? 0 : undefined}
        left={0}
        right={0}
        alignItems="center"
        justifyContent="center"
        zi={50000}
      >
        {/*@ts-ignore*/}
        <XStack width="100%" maw={dettached ? 1120 : undefined} pos="relative">
          <XStack
            className={`ease-out all ms200 ${isScrolled && dettached ? 'blur-medium hover-highlights ' : ''}`}
            height={dettached ? undefined : height}
            bbc="$borderColor"
            py={dettached ? "$1" : "$2"}
            y={dettached && position == 'top' ? 3 : 0}
            ov="hidden"
            contain="paint"
            width="100%"
            bw={0}
            boc="transparent"
            br={dettached ? "$10" : 0}
            $sm={{
              //@ts-ignore
              br: 0,
              y: 0,
              py: '$2',
            }}
            {...(isScrolled && {
              $gtSm: dettached ? {
                py: '$2',
                y: 5,
                boc: '$borderColor',
              } : {},
            })}
          >
            {/*@ts-ignore*/}
            <YStack o={translucid ? (isScrolled ? 0.75 : 0) : 1} fullscreen bc={backgroundColor} />
            {fullscreen ? <YStack justifyContent="center" width={'100%'}>{getContent()}</YStack> : <ContainerLarge>{getContent()}</ContainerLarge>}
          </XStack>
          {/* do shadow separate so we can contain paint because its causing perf issues */}
          <XStack
            className={`ease-out all ms200`}
            //@ts-ignore
            zi={-1}
            br="$10"
            fullscreen
            {...(isScrolled && {
              $gtSm: dettached ? {
                py: '$2',
                y: 5,
                elevation: '$3',
                boc: '$borderColor',
              } : {},
            })}
          />
        </XStack>
      </XStack>
      {/*@ts-ignore*/}
      {dettached ? <YStack height={54} w="100%" /> : null}
    </>
  )
})

export default AppBar