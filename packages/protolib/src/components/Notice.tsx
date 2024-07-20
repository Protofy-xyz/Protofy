import React from 'react'
import { Paragraph, Theme, XStack, styled } from 'tamagui'

import { unwrapText } from './unwrapText'

export const Notice = React.forwardRef(({ children, theme = 'yellow', disableUnwrap, ...props }: any, ref: any) => {
  return (
    <NoticeFrame ref={ref} theme={theme} {...props}>
      {/*@ts-ignore*/}
      <Paragraph paddingVertical="$2" theme="alt1" marginTop={-3} marginBottom={-3} className="paragraph-parent">
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
  padding: '$4',
  paddingVertical: '$3',
  backgroundColor: '$background',
  borderRadius: '$4',
  space: '$3',
  marginVertical: '$4',
  position: 'relative',
})
