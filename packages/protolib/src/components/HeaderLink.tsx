
import { useRouter } from 'next/router'
import * as React from 'react'
import { Paragraph, TooltipSimple, styled } from 'tamagui'
import { NextLink } from './NextLink'
import { AppBarProps } from './AppBar'

const HeadAnchor = styled(Paragraph, {
  fontFamily: '$silkscreen',
  //@ts-ignore
  px: '$3', py: '$2',  size: '$3',  w: '100%',
  cursor: 'pointer',
  color: '$color10',
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
