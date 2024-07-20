import React from 'react';
import { YStack, styled } from 'tamagui'

const StyledUL = styled(YStack, {
  tag: 'ul',
  //@ts-ignore
  marginVertical: '$1',
  marginLeft: '$4',
  marginRight: '$2',
  display: 'inline'
})


export const UL = React.forwardRef((props: any, ref: any) => {
  return <StyledUL ref={ref} {...props}>
    {props.children}
  </StyledUL>;
})