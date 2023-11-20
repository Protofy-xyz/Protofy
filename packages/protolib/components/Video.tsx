import React from 'react'
import { Stack, StackProps } from 'tamagui'

type ImageProps = {
  width?: number | string
  height?: number | string
  url?: string
}

export default React.forwardRef(({ width = "800", url = "/images/visual-ui-dark.mp4", ...props }: ImageProps & StackProps, ref) => (
  <Stack ref={ref} {...props} borderWidth="1px" borderColor={"$gray8"} borderStyle='dotted'>
    <video controls={false} muted={true} width={width} autoPlay={true} loop={true} >
      <source src={url} type="video/mp4" />
    </video>
  </Stack>
))