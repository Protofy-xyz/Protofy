import { Paragraph, styled } from 'tamagui'
import React from "react"

const StyledCode = styled(Paragraph, {
  name: 'Code',
  tag: 'code',
  fontFamily: '$mono',
  size: '$3',
  lineHeight: 18,
  cursor: 'inherit',
  whiteSpace: 'pre',
  padding: '$1',
  borderRadius: '$4',

  variants: {
    colored: {
      true: {
        color: '$color',
        backgroundColor: '$background',
      },
    },
  } as const,
})

const StyledCodeInline = styled(Paragraph, {
  name: 'CodeInline',
  tag: 'code',
  fontFamily: '$mono',
  color: '$colorHover',
  backgroundColor: '$background',
  cursor: 'inherit',
  //@ts-ignore
  br: '$3',
  // @ts-ignore
  fontSize: '85%',
  //@ts-ignore
  p: '$1.5',
})

export const Code = React.forwardRef((props: any, ref: any) => {
  return <StyledCode ref={ref} {...props}>
    {props.children ? props.children : null}
  </StyledCode>;
})

export const CodeInline = React.forwardRef((props: any, ref: any) => {
  return <StyledCodeInline ref={ref} {...props}>
    {props.children ? props.children : null}
  </StyledCodeInline>;
})




