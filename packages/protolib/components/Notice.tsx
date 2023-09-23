import React from 'react'
import { Paragraph, Theme, XStack, styled } from 'tamagui'

import { unwrapText } from './unwrapText'

export const Notice = React.forwardRef(({ children, theme = 'yellow', disableUnwrap, ...props }: any, ref:any) => {
  return (
    <NoticeFrame ref={ref} theme={theme} {...props}>
      {/*@ts-ignore*/}
      <Paragraph py="$2" theme="alt1" mt={-3} mb={-3} className="paragraph-parent">
        {disableUnwrap ? children : unwrapText(children)}
      </Paragraph>
    </NoticeFrame>
  )
})

export const NoticeFrame = styled(XStack, {
  className: 'no-opacity-fade',
  borderWidth: 1,
  borderColor: '$borderColor',
  //@ts-ignore
  p: '$4',
  py: '$3',
  bc: '$background',
  br: '$4',
  space: '$3',
  my: '$4',
  pos: 'relative',
})
