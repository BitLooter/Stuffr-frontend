var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

var appPath = path.join(__dirname, '/app')

var htmlWebpackPluginConfig = new HtmlWebpackPlugin({
  title: 'Stuffr',
  template: path.join(__dirname, '/app/index.ejs'),
  inject: 'body',
  xhtml: true,
  hash: true
})

var copyStaticFilesConfig = new CopyWebpackPlugin(
  [{
    from: 'locales',
    to: 'locales'
  }],
  {copyUnmodified: true}
)

module.exports = {
  devtool: 'cheap-eval-source-map',
  context: appPath,
  entry: [
    'babel-polyfill',
    'isomorphic-fetch',
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
          presets: ['es2015', 'stage-1', 'react']
        }
      }
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
