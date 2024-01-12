import { createTamagui } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { createMedia } from '@tamagui/react-native-media-driver'
import { createCherryBombFont } from '@tamagui/font-cherry-bomb'
import { createDmSansFont } from '@tamagui/font-dm-sans'
import { createDmSerifDisplayFont } from '@tamagui/font-dm-serif-display'
import { createMunroFont } from '@tamagui/font-munro'
import { createSilkscreenFont } from '@tamagui/font-silkscreen'
import { createGenericFont } from './createGenericFont'
import { animations } from './animations'
import { themes } from './themes'
import { tokens } from './tokens'

export const cherryBombFont = createCherryBombFont()
export const munroFont = createMunroFont()

const silkscreenFont = createSilkscreenFont()
const headingFont = createInterFont(
  {
    size: {
      5: 13,
      6: 15,
      9: 32,
      10: 44,
    },
    transform: {
      6: 'uppercase',
      7: 'none',
    },
    weight: {
      6: '400',
      7: '700',
    },
    color: {
      6: '$colorFocus',
      7: '$color',
    },
    letterSpacing: {
      5: 2,
      6: 1,
      7: 0,
      8: 0,
      9: -0.1,
      10: -0.25,
      11: -0.5,
      12: -0.75,
      14: -1,
      15: -2,
    },
    // for native
    face: {
      700: { normal: 'InterBold' },
      800: { normal: 'InterBold' },
      900: { normal: 'InterBold' },
    },
  },
  { sizeLineHeight: (size) => Math.round(size * 1.1 + (size < 30 ? 10 : 5)) }
)

const dmSansHeadingFont = createDmSansFont(
  {
    size: {
      5: 13,
      6: 15,
      9: 32,
      10: 44,
    },
    transform: {
      6: 'uppercase',
      7: 'none',
    },
    weight: {
      6: '400',
      7: '700',
    },
    color: {
      6: '$colorFocus',
      7: '$color',
    },
    letterSpacing: {
      5: 2,
      6: 1,
      7: 0,
      8: 0,
      9: -0.1,
      10: -0.25,
      11: -0.5,
      12: -0.75,
      14: -1,
      15: -2,
    },
    face: {},
  },
  { sizeLineHeight: (size) => Math.round(size * 1.1 + (size < 30 ? 10 : 5)) }
)
const dmSerifDisplayHeadingFont = createDmSerifDisplayFont(
  {
    size: {
      5: 13,
      6: 15,
      9: 32,
      10: 44,
    },
    transform: {
      6: 'uppercase',
      7: 'none',
    },
    weight: {
      6: '400',
      7: '700',
    },
    color: {
      6: '$colorFocus',
      7: '$color',
    },
    letterSpacing: {
      5: 2,
      6: 1,
      7: 0,
      8: 0,
      9: -0.1,
      10: -0.25,
      11: -0.5,
      12: -0.75,
      14: -1,
      15: -2,
    },
    face: {},
  },
  { sizeLineHeight: (size) => Math.round(size * 1.1 + (size < 30 ? 10 : 5)) }
)

const bodyFont = createInterFont(
  {
    weight: {
      1: '400',
    },
  },
  {
    sizeSize: (size) => Math.round(size),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size >= 12 ? 8 : 4)),
  }
)

const monoFont = createGenericFont(
  `"ui-monospace", "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`,
  {
    weight: {
      1: '500',
    },
    size: {
      1: 11,
      2: 12,
      3: 13,
      4: 13,
      5: 14,
      6: 16,
      7: 18,
      8: 20,
      9: 24,
      10: 32,
      11: 46,
      12: 62,
      13: 72,
      14: 92,
      15: 114,
      16: 124,
    },
  },
  {
    sizeLineHeight: (x) => x * 1.5,
  }
)
const defaultDataConfig = {
  defaultFont: 'body',
  animations,
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    heading: headingFont,
    headingDmSans: dmSansHeadingFont,
    headingDmSerifDisplay: dmSerifDisplayHeadingFont,
    body: bodyFont,
    mono: monoFont,
    silkscreen: silkscreenFont,
    munro: munroFont,
    cherryBomb: cherryBombFont,
  },
  themes,
  tokens,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
}

function spreadRecursive(config, configExtension) {
  const tmpConfig = { ...config };
  for (const key in configExtension) {
    if (configExtension.hasOwnProperty(key)) {
      if (
        typeof configExtension[key] === 'object' &&
        config.hasOwnProperty(key) &&
        typeof config[key] === 'object'
        ) {
          tmpConfig[key] = spreadRecursive(config[key], configExtension[key]);
        } else {
          tmpConfig[key] = configExtension[key];
        }
      }
    }
    return tmpConfig;
  }
  
  export const createConfig = (aditionalConfig: any = {}) => {
    const newConfig = spreadRecursive(defaultDataConfig, aditionalConfig)
    return createTamagui(newConfig)
  }

  export const config = createConfig()