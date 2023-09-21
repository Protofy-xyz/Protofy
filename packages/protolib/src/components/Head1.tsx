import { H1, styled } from 'tamagui'
import React from "react"

const StyledHead1 = styled(H1, {
  className: 'word-break-keep-all',
  //@ts-ignore
  size: '$9', mb: '$2',
  $gtSm: {
    //@ts-ignore
    size: '$10',
    maxWidth: '90%',
  },
})

export const Head1 = React.forwardRef((props: any, ref: any) => {
  return <StyledHead1 ref={ref} {...props}>
    {props.children}
  </StyledHead1>;
})