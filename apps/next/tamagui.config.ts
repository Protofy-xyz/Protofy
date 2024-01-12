// don't import from here, that's handled already
// instead this is just setting types for this folder

import { config, createConfig } from '@my/ui'

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
export default createConfig({
  // example
  // settings: {
  //   defaultTint: 'orange'
  // },
  // themes: {
  //   dark_green: {
  //     color:'#00FF00'
  //   }
  // }
})
