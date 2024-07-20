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

export const AppBar = React.forwardRef(({ backgroundColor, containerProps = {}, height = undefined, fullscreen = false, translucid = true, dettached = true, position = 'top', ...props }: AppBarProps, ref: any) => {
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

  const [_, forceUpdate] = React.useState<any>(false) //TODO: create generic function for fixed
  const [top, setTop] = React.useState<any>(0) //TODO: create generic function for fixed
  React.useEffect(() => {
    // Note: This useEffect makes AppBar responsive for visual ui
    const pageElem = document.getElementById('protolib-page-container')
    const resizeHandler = () => {
      //@ts-ignore
      headerContainerRef.current.width = pageElem?.offsetWidth
      headerContainerRef.current.top = pageElem?.clientTop
      setTop(pageElem?.clientTop)
      forceUpdate(s => !s)
    };
    if (pageElem) {
      const resizeObserver = new ResizeObserver(resizeHandler);
      resizeObserver.observe(pageElem);

      return () => {
        resizeObserver.unobserve(pageElem);
        resizeObserver.disconnect();
      };
    }
  }, []);

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
        backgroundColor={backgroundColor}
        ref={headerContainerRef}
        // @ts-ignore
        position="fixed"
        top={top ?? position == 'top' ? 0 : undefined}
        bottom={position == 'bottom' ? 0 : undefined}
        // alignSelf='center'
        right={0}
        left={0}
        alignItems="center"
        justifyContent="center"
        zi={50000}
        width={headerContainerRef.current?.width ?? "100%"}
      >
        {/*@ts-ignore*/}
        <XStack width="100%" maxWidth={dettached ? 1120 : undefined} position="relative">
          {/*@ts-ignore*/}
          <XStack
            className={`ease-out all ms200 ${isScrolled && dettached ? 'blur-medium hover-highlights ' : ''}`}
            height={dettached ? undefined : height}
            borderBottomColor="$borderColor"
            paddingVertical={dettached ? "$1" : "$2"}
            y={dettached && position == 'top' ? 3 : 0}
            overflow="hidden"
            contain="paint"
            width="100%"
            borderWidth={0}
            borderColor="transparent"
            borderRadius={dettached ? "$10" : 0}
            $sm={{
              //@ts-ignore
               borderRadius: 0,
              y: 0,
              paddingVertical: '$2',
            }}
            {...(isScrolled && {
              $gtSm: dettached ? {
                paddingVertical: '$2',
                y: 5,
                boc: '$borderColor',
              } : {},
            })}
          >
            {/*@ts-ignore*/}
            <YStack opacity={translucid ? (isScrolled ? 0.75 : 0) : 1} fullscreen backgroundColor={backgroundColor} />
            {fullscreen ? <YStack justifyContent="center" width={'100%'}>{getContent()}</YStack> : <ContainerLarge>{getContent()}</ContainerLarge>}
          </XStack>
          {/* do shadow separate so we can contain paint because its causing perf issues */}
          <XStack
            className={`ease-out all ms200`}
            //@ts-ignore
            zi={-1}
            borderRadius="$10"
            fullscreen
            {...(isScrolled && {
              $gtSm: dettached ? {
                paddingVertical: '$2',
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