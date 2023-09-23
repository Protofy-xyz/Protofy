import { H3, styled } from 'tamagui'
import React from "react"

const StyledHead3 = styled(H3, {
  className: 'word-break-keep-all',
  fontFamily: '$body',
  name: 'HomeH3',
  theme: 'alt1',
  //@ts-ignore
  ta: 'center', als: 'center', px: 20, size: '$8', fow: '400', o: 0.9, ls: -0.15, maw: 690,
  $sm: {
    //@ts-ignore
    size: '$6', fow: '400',
    color: '$color',
    textTransform: 'none',
  },
})

export const Head3 = React.forwardRef((props: any, ref: any) => {
  return <StyledHead3 ref={ref} {...props}>
    {props.children}
  </StyledHead3>;
})