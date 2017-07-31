module.exports = {
  plugins: [
    require('postcss-import'),
    require('autoprefixer'),
    require('postcss-cssnext')({
      features: {
        autoprefixer: false
      }
    }),
    require('postcss-reporter'),
    require('postcss-browser-reporter'),
    require('cssnano')({
      preset: 'default',
      autoprefixer: false,
    }),
  ]
}
