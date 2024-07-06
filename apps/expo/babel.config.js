module.exports = function (api) {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root: ['../..'],
          alias: {
            // define aliases to shorten the import paths
            'protoflow/src/diagram/Theme': '../../packages/protoflow/src/diagram/Theme.tsx',
            'protoflow/src/fields/WeekdayPicker': '../../packages/protoflow/src/fields/WeekdayPicker.tsx',
            'protoflow/src/diagram/NodeText' : '../../packages/protoflow/src/diagram/NodeText.tsx',
            protoflow: '../../packages/protoflow/src',
            protolib: '../../packages/protolib/src',
            app: '../../packages/app',
            '@my/ui': '../../packages/ui',
            stream: 'stream-browserify',
            path: 'path-browserify',
            crypto: 'react-native-crypto',
            fs: 'react-native-fs',
            zlib: 'empty-module',
            'nanoid/format': 'empty-module'
          },
          extensions: ['.js', '.jsx', '.tsx', '.ios.js', '.android.js'],
        },
      ],
      // if you want reanimated support
      // 'react-native-reanimated/plugin',
      ...(process.env.EAS_BUILD_PLATFORM === 'android'
        ? []
        : [
            [
              '@tamagui/babel-plugin',
              {
                components: ['@my/ui', 'tamagui'],
                config: './tamagui.config.ts',
                logTimings: true,
                disableExtraction: process.env.NODE_ENV === 'development',
              },
            ],
          ]),
    ],
  }
}
