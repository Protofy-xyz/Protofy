
import * as React from 'react'
import { Paragraph, styled } from 'tamagui'
import { NextLink } from './NextLink'

export const HeadAnchor = styled(Paragraph, {
  //@ts-ignore
  paddingHorizontal: '$3', paddingVertical: '$2',  size: '$5',  width: '100%',
  cursor: 'pointer',
  fontFamily: "$heading",
  fontWeight: "600",
  opacity: 0.8,
  color: "$color8",
  //@ts-ignore
  hoverStyle: { opacity: 1, color: '$color' }, pressStyle: { opacity: 0.25 },
  tabIndex: -1
})

export const HeaderLink = React.forwardRef(({children, ...props}:any, ref:any) => {
  return (
      <NextLink prefetch={false} ref={ref} {...props}>
        <HeadAnchor>
          {children}
        </HeadAnchor>
      </NextLink>
  )
})
