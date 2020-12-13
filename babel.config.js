module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-proposal-optional-chaining'],
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@root': './src',
            '@api': './src/api',
            '@components': './src/components',
            '@screens': './src/screens',
            '@utils': './src/utils'
          }
        }
      ]
    ]
  }
}
