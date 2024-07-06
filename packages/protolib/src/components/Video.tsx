import React from 'react'
import { Stack, StackProps } from 'tamagui'

type ImageProps = {
  width?: number | string
  height?: number | string
  url?: string
}

export default React.forwardRef(({ width = "800", url = "/videos/visual-ui-dark.mp4", ...props }: ImageProps & StackProps, ref) => (
  <Stack ref={ref} {...props}>
    <video controls={false} muted={true} width={width} autoPlay={true} loop={true} >
      <source src={url} type="video/mp4" />
    </video>
  </Stack>
))