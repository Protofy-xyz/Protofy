import { XStack, YStack } from "@my/ui"
import { processActionBar } from "app/bundles/actionBar"
import { useRouter } from 'next/router'

export const ActionBarButton = ({ Icon, selected = false, ...props }) => {
  const size = 34
  return <YStack
    jc="center"
    ai="center"
    br="$4"
    cursor='pointer'
    scaleIcon={1.8}
    w={size}
    h={size}
    hoverStyle={{ bg: '$gray2' }}
    {...props}
  >
    <Icon size={20} color={selected ? "var(--color8)" : "var(--color)"} fill={props.fill ? "var(--color)" : "transparent"} {...props.iconProps} />
  </YStack>
}

export const useActionBar = (actionBar?, onActionBarEvent?) => {
  const router = useRouter()

  let currentBar

  if (actionBar) {
    currentBar = actionBar
  } else {
    currentBar = processActionBar(router, actionBar, onActionBarEvent)
  }

  return currentBar && currentBar.content?.length > 0 && <XStack
    p="$2"
    als="center"
    pos="fixed"
    elevation={10}
    bw={1}
    boc="var(--gray6)"
    animation="quick"
    bc="var(--bgPanel)"
    zi={99999}
    b={currentBar.visible === false ? -200 : 16}
    gap="$3"
    br="$5"
    enterStyle={{ b: -200 }}
  >
    {
      currentBar.content?.map((item, index) => {
        return item
      })
    }
  </XStack>
}   