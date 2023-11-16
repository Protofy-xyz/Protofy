import React from 'react'
import {
  H1, ParagraphProps,
} from 'tamagui'

type BigTitleProps = {
    children?:any
}

export default React.forwardRef(({children, ...props}:BigTitleProps & ParagraphProps, ref) => (
    <H1
    //@ts-ignore
    ref={ref}
    //@ts-ignore
    ta="left"
    size="$10"
    //@ts-ignore
    maw={500}
    // FOR CLS IMPORTANT TO SET EXACT HEIGHT IDK WHY LINE HEIGHT SHOULD BE STABLE
    $gtSm={{
      //@ts-ignore
      mx: 0,
      maxWidth: 800,
      //@ts-ignore
      size: '$13',
      //@ts-ignore
      ta: 'center',
      //@ts-ignore
      als: 'center',
    }}
    $gtMd={{
      maxWidth: 900,
      size: '$14',
    }}
    $gtLg={{
      //@ts-ignore
      size: '$16',
      //@ts-ignore
      lh: '$15',
      maxWidth: 1200,
    }}
    {...props}
  >
    {children}
  </H1>
))