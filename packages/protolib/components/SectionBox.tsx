import { forwardRef } from "react"
import { useTint } from "@tamagui/logo"
import { useMemo } from "react"
import { YStack } from "tamagui"

const SectionBox = forwardRef(({
  children,
  gradient,
  extraPad,
  bubble,
  noBorderTop,
  ...props
}: any, ref: any) => {
  const { tint } = useTint()
  const childrenMemo = useMemo(() => children, [children])

  return (
    <YStack
      ref={ref}
      zi={2}
      contain="paint"
      pos="relative"
      py="$14"
      elevation="$2"
      {...(bubble && {
        maw: 1400,
        br: '$6',
        bw: 1,
        boc: `$${tint}4`,
        als: 'center',
        width: '100%',
      })}
      {...props}
    >
      <YStack
        fullscreen
        className="all ease-in ms1000"
        zIndex={-1}
        opacity={0.4}
        backgroundColor={gradient ? (`$${tint}2` as any) : null}
        {...(!bubble && {
          btw: noBorderTop ? 0 : 1,
          bbw: 1,
          boc: `$${tint}3` as any,
        })}
      />
      {childrenMemo}
    </YStack>
  )
})

export default SectionBox