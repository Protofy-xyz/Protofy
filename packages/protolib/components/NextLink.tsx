import NextInternalLink from 'next/link'
import * as React from 'react'

export const NextLink = React.forwardRef((props:any, ref:any) => {
  return (
    <NextInternalLink ref={ref} {...props} className={`next-link ` + (props.className || '')} />
  )
}) as typeof NextInternalLink
