var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

var appPath = path.join(__dirname, '/app')

var defaultConfig = {
  apiPath: '/api',
  authPath: '/auth'
}
var localConfig = defaultConfig
if (process.env.NODE_ENV) {
  try {
    localConfig = require(`config.${process.env.NODE_ENV}.js`)
  } catch (e) {
    // No local config exists, ignore
  }
}
// TODO: use spread operator when available, general cleanup
var siteConfig = {
  apiPath: localConfig.apiPath || defaultConfig.apiPath,
  authPath: localConfig.authPath || defaultConfig.authPath
}

var htmlWebpackPluginConfig = new HtmlWebpackPlugin({
  title: 'Stuffr',
  template: path.join(__dirname, '/app/index.ejs'),
  xhtml: true,
  hash: true,
  siteConfig: JSON.stringify(siteConfig)
})

var copyStaticFilesConfig = new CopyWebpackPlugin(
  [{
    from: 'locales',
    to: 'locales'
  }],
  {copyUnmodified: true}
)

module.exports = {
  devtool: 'eval-source-map',
  context: appPath,
  entry: [
    'babel-polyfill',
    'isomorphic-fetch',
    './style.styl',
    './index.js'
  ],
  module: {
    preLoaders: [
      {
        test: /\.js?$/,
        include: appPath,
        loader: 'eslint'
      }
    ],
    loaders: [
      {
        test: /\.js?$/,
        include: appPath,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-1', 'react'],
          plugins: ['transform-decorators-legacy']
        }
      },
      { test: /\.css$/, include: appPath, loader: 'style!css' },
      { test: /\.styl$/, include: appPath, loader: 'style!css!stylus' }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/dist')
  },
  plugins: [
    htmlWebpackPluginConfig,
    copyStaticFilesConfig
  ]
}
