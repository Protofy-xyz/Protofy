import React from 'react'
import {
  AvatarImageProps,
  Image as TamaguiImage
} from 'tamagui'

type ImageProps = {
  width?: number | string
  height?: number | string
  url?: string,
}

export const Image = React.forwardRef(({ width = 200, height, url = "/images/patterns/pattern-1.png", ...props }: ImageProps & AvatarImageProps, ref) => (
  <TamaguiImage
    //@ts-ignore
    ref={ref}
    //@ts-ignore
    source={{ width, height: height ?? width, uri: url }}
    {...props}
  />
))

export default Image