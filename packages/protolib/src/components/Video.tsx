import React from 'react'
import { Stack, StackProps, TamaguiElement } from 'tamagui'

type ImageProps = {
  width?: number | string
  height?: number | string
  url?: string
}

export const Video = React.forwardRef(({ width = "800", url = "/videos/visual-ui-dark.mp4", ...props }: ImageProps & StackProps, ref) => (
  <Stack ref={ref as React.RefObject<TamaguiElement>} {...props}>
    <video controls={false} muted={true} width={width} autoPlay={true} loop={true} >
      <source src={url} type="video/mp4" />
    </video>
  </Stack>
))

export default Video