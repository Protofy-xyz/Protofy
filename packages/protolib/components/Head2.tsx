import { H2, styled } from 'tamagui'
import React from "react"

const StyledHead2 = styled(H2, {
  className: 'word-break-keep-all',
  //@ts-ignore
  name: 'HomeH2', ta: 'center', als: 'center', size: '$10', maw: 720, mt: '$-2',
  //@ts-ignore
  $sm: {
    //@ts-ignore
    size: '$10',
  },
  //@ts-ignore
  $xs: {
    //@ts-ignore
    size: '$9',
  },
})

export const Head2 = React.forwardRef((props: any, ref: any) => {
  return <StyledHead2 ref={ref} {...props}>
    {props.children}
  </StyledHead2>;
})