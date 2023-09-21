import React from 'react';
import { YStack, styled } from 'tamagui'

const StyledIconStack = styled(YStack, {
  //@ts-ignore
  br: 100,
  bc: '$background',
  p: '$2',
  als: 'flex-start',
})

export const IconStack = React.forwardRef((props: any, ref: any) => {
  return <StyledIconStack ref={ref} {...props}>
    {props.children ? props.children : null}
  </StyledIconStack>;
})