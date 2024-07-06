import React from 'react';
import { YStack, styled } from 'tamagui'

const StyledPre = styled(YStack, {
  overflow: 'visible',
  tag: 'pre',
  padding: '$4',
  borderRadius: '$4',
  //@ts-ignore
  bc: '$background',
})

export const Pre = React.forwardRef((props: any, ref: any) => {
  return <StyledPre ref={ref} {...props}>
    {props.children}
  </StyledPre>;
})