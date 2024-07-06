import React from 'react';
import { YStack, styled } from 'tamagui'

const StyledFancyCard = styled(YStack, {
  name: 'Card',
  //@ts-ignore
  f: 1,
  className: 'transition all ease-in ms100',
  borderRadius: '$6',
  // backgroundColor: '$background',
  flexShrink: 1,
  hoverStyle: {
    borderColor: 'rgba(150,150,150,0.4)',
    elevation: '$6',
    y: '$-1',
  },
})

const StyledOuterSubtleBorder = styled(YStack, {
  className: 'transition all ease-in ms100',
  borderWidth: 5,
  flex: 1,
  borderColor: 'rgba(150,150,150,0.05)',
  borderRadius: '$7',
})


export const FancyCard = React.forwardRef((props: any, ref: any) => {
  return <StyledFancyCard ref={ref} {...props}>
    {props.children ? props.children : null}
  </StyledFancyCard>;
})
export const OuterSubtleBorder = React.forwardRef((props: any, ref: any) => {
  return <StyledOuterSubtleBorder ref={ref} {...props}>
    {props.children ? props.children : null}
  </StyledOuterSubtleBorder>;
})