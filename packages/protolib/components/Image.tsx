import React from 'react'
import {
  AvatarImageProps,
  Image
} from 'tamagui'

type ImageProps = {
  width?: number | string
  height?: number | string
  url?: string,
}

export default React.forwardRef(({ width = 200, height, url = "https://picsum.photos/200", ...props }: ImageProps & AvatarImageProps, ref) => (
  <Image
    //@ts-ignore
    ref={ref}
    //@ts-ignore
    source={{ width, height: height ?? width, uri: url }}
    {...props}
  />
))