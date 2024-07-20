import { Text as TamaguiText, styled, TextProps } from 'tamagui'
import React from "react"

const StyledText = styled(TamaguiText, {
  className: 'word-break-keep-all',
  //@ts-ignore
  size: '$9', marginBottom: '$2',
  $gtSm: {
    //@ts-ignore
    size: '$10',
    maxWidth: '90%',
  },
})

export const Text = React.forwardRef((props: TextProps, ref: any) => {
  //@ts-ignore
  return <StyledText ref={ref} {...props}>
    {props.children}
  </StyledText>;
})