import React from 'react'
import {
  Image
} from 'tamagui'

type ImageProps = {
  width?: number | string
  height?: number | string
  url?: string
}

export default React.forwardRef(({ width = 200, height = 200, url = "https://picsum.photos/200", ...props }: ImageProps, ref) => (
  <Image
    //@ts-ignore
    ref={ref}
    //@ts-ignore
    source={{ width, height: width, uri: url }}
    width={width}
    height={width}
    {...props}
  />
))