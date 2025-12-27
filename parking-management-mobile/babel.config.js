module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@features': './src/features',
          '@navigation': './src/navigation',
          '@services': './src/services',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@theme': './src/theme',
          '@api': './src/api',
          '@store': './src/store',
          '@constants': './src/constants',
          '@types': './src/types',
          '@assets': './src/assets',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
