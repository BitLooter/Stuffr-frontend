const CompressionPlugin = require('compression-webpack-plugin')
const settings = require('./webpack.common.config')

const CompressionPluginConfig = new CompressionPlugin({
  algorithm: 'gzip',
  threshold: 4096
})

settings.devtool = 'cheap-module-source-map'
settings.plugins.push(CompressionPluginConfig)

module.exports = settings
