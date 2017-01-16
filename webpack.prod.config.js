var webpack = require('webpack')
var CompressionPlugin = require('compression-webpack-plugin')
var settings = require('./webpack.config')

var prodPlugins = [
  new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new CompressionPlugin({
    algorithm: 'gzip',
    threshold: 4096
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  })
]

settings.devtool = 'cheap-module-source-map'
settings.plugins = settings.plugins.concat(prodPlugins)
delete settings.module.preLoaders
// eslint-disable-next-line prefer-template
settings.output.path = settings.output.path + '-prod'

module.exports = settings
