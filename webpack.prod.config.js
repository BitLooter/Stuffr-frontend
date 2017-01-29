const CompressionPlugin = require('compression-webpack-plugin')
const settings = require('./webpack.config')
//
const prodPlugins = [
  new CompressionPlugin({
    algorithm: 'gzip',
    threshold: 4096
  })
]

settings.module.rules = settings.module.rules.filter((rule) => {
  return rule.enforce !== 'pre'
})
settings.devtool = 'cheap-module-source-map'
settings.plugins = settings.plugins.concat(prodPlugins)

module.exports = settings
