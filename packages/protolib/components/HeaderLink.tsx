
import { useRouter } from 'next/router'
import * as React from 'react'
import { Paragraph, TooltipSimple, styled } from 'tamagui'
import { NextLink } from './NextLink'
import { AppBarProps } from './AppBar'

const HeadAnchor = styled(Paragraph, {
  //@ts-ignore
  px: '$3', py: '$2',  size: '$5',  w: '100%',
  cursor: 'pointer',
  fontFamily: "$heading",
  fontWeight: "600",
  color: '$color8',
  opacity: 0.8,
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
