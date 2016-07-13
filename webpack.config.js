var HtmlWebpackPlugin = require('html-webpack-plugin')

var htmlWebpackPluginConfig = new HtmlWebpackPlugin({
  title: 'Stuffr',
  template: __dirname + '/app/index.ejs',
  inject: 'body',
  xhtml: true,
  hash: true
})

module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: [
    'babel-polyfill',
    './app/index.js'
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: __dirname + '/app',
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-1'],
          plugins: ['transform-object-rest-spread']
        }
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },
  plugins: [
    htmlWebpackPluginConfig
  ]
}
