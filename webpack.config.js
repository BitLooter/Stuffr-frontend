const path = require('path')
const webpack = require('webpack')
const settings = require('./webpack.common.config')
const config = require('./config')

const appPath = path.join(__dirname, '/app')

settings.devtool = 'eval-source-map'
// Enable hot reloading
settings.entry.splice(-1, 0,
  `webpack-dev-server/client?http://${config.clientServerHost}:${config.devServerPort}`,
  'webpack/hot/only-dev-server')
settings.module.rules[0].use.unshift({loader: 'react-hot-loader'})
settings.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin())
// Run linter on build
settings.module.rules.unshift({
  test: /\.js?$/,
  include: appPath,
  enforce: 'pre',
  loader: 'eslint-loader'
})

module.exports = settings
