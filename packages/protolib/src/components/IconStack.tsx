import React from 'react';
import { YStack, styled } from 'tamagui'

const StyledIconStack = styled(YStack, {
  //@ts-ignore
   borderRadius: 100,
  backgroundColor: '$background',
  padding: '$2',
  alignSelf: 'flex-start',
})

export const IconStack = React.forwardRef((props: any, ref: any) => {
  return <StyledIconStack ref={ref} {...props}>
    {props.children ? props.children : null}
  </StyledIconStack>;
})