var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var htmlWebpackPluginConfig = new HtmlWebpackPlugin({
  title: 'Stuffr',
  template: path.join(__dirname, '/app/index.ejs'),
  inject: 'body',
  xhtml: true,
  hash: true
})

module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: [
    'babel-polyfill',
    'isomorphic-fetch',
    './app/index.js'
  ],
  module: {
    preLoaders: [
      {
        test: /\.js?$/,
        include: [path.join(__dirname, '/app'), path.join(__dirname, '/test')],
        loader: 'eslint'
      }
    ],
    loaders: [
      {
        test: /\.js?$/,
        include: path.join(__dirname, '/app'),
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
    htmlWebpackPluginConfig
  ]
}
