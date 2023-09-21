import React from 'react'
import { YStack, styled } from 'tamagui'

const variants = {
  hide: {
    true: {
      pointerEvents: 'none',
      opacity: 0,
    },
  },
} as const

const StyledContainer = styled(YStack, {
  mx: 'auto',
  px: '$4',
  width: '100%',

  $gtSm: {
    maxWidth: 700,
    //@ts-ignore
    pr: '$2',
  },

  $gtMd: {
    maxWidth: 740,
    //@ts-ignore
    pr: '$2',
  },

  $gtLg: {
    maxWidth: 800,
    //@ts-ignore
    pr: '$10',
  },

  variants,
})

const StyledContainerLarge = styled(YStack, {
  //@ts-ignore
  mx: 'auto',
  px: '$4',
  width: '100%',

  $gtSm: {
    maxWidth: 980,
  },

  $gtMd: {
    maxWidth: 1140,
  },

  variants,
})

const StyledContainerXL = styled(YStack, {
  //@ts-ignore
  mx: 'auto',
  px: '$4',
  width: '100%',

  $gtSm: {
    maxWidth: 980,
  },

  $gtMd: {
    maxWidth: 1240,
  },

  $gtLg: {
    maxWidth: 1440,
  },

  variants,
})

export const Container = React.forwardRef((props: any, ref: any) => {
  return <StyledContainer ref={ref} {...props}>
    {props.children ? props.children : null}
  </StyledContainer>;
})
export const ContainerLarge = React.forwardRef((props: any, ref: any) => {
  return <StyledContainerLarge ref={ref} {...props}>
    {props.children ? props.children : null}
  </StyledContainerLarge>;
})
export const ContainerXL = React.forwardRef((props: any, ref: any) => {
  return <StyledContainerXL ref={ref} {...props}>
    {props.children ? props.children : null}
  </StyledContainerXL>;
})