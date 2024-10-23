/** @type {import('next').NextConfig} */
const { withTamagui } = require('@tamagui/next-plugin')
const { join, resolve } = require('path')
const webpack = require('webpack');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.PROFILER_ENABLED === 'true',
})

const dotenv = require('dotenv');
dotenv.config({ path: resolve(__dirname, '../../.env') });

const boolVals = {
  true: true,
  false: false,
}

const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development'

const plugins = [
  withTamagui({
    config: './tamagui.config.ts',
    components: ['tamagui', '@my/ui'],
    importsWhitelist: ['constants.js', 'colors.js'],
    outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
    logTimings: true,
    disableExtraction,
    // experiment - reduced bundle size react-native-web
    useReactNativeWebLite: false,
    shouldExtract: (path) => {
      if (path.includes(join('packages', 'app')) || path.includes(join('packages', 'protolib')) ) {
        return true
      }
    },
    //excludeReactNativeWebExports: ['Switch', 'ProgressBar', 'Picker', 'CheckBox', 'Touchable'],
  }),
]

module.exports = function () {
  /** @type {import('next').NextConfig} */
  let config = {
    output: 'standalone',
    typescript: {
      ignoreBuildErrors: true,
    },
    modularizeImports: {
      '@tamagui/lucide-icons': {
        transform: `@tamagui/lucide-icons/dist/esm/icons/{{kebabCase member}}`,
        skipDefaultConversion: true,
      },
    },
    transpilePackages: [
      'solito',
      'react-native-web',
      'expo-linking',
      'expo-constants',
      'expo-modules-core',
    ],
    experimental: {
      scrollRestoration: true,
      outputFileTracingRoot: join(__dirname, '../../'),
    },
    webpack: (config, options) => {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^perf_hooks$/,
        })
      );
  
      if (!options.isServer) {
        config.ignoreWarnings = [
          /critical dependency:/i,
          /perf_hooks/i,
          /can't resolve 'perf_hooks'/i
        ];
      }
      config.resolve.alias['protolib'] = resolve(__dirname, '../../packages/protolib/src');
      
      return config;
    }
  }

  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    }
  }

  

  return withBundleAnalyzer(config)
}
