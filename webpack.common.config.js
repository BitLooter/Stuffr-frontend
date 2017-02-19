const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require('./config')

const appPath = path.join(__dirname, '/app')

// Need package.json to get current version
const packageConfig = require('./package.json')

let overlayMessage
try {
  // eslint-disable-next-line no-sync
  overlayMessage = fs.readFileSync(path.join(__dirname, '/overlay.html'))
} catch (e) {
  // No overlay.html file, ignore error
}

const siteConfig = {
  apiPath: config.apiPath,
  authPath: config.authPath,
  frontendVersion: packageConfig.version
}

const htmlWebpackPluginConfig = new HtmlWebpackPlugin({
  title: 'Stuffr',
  template: path.join(__dirname, '/app/index.ejs'),
  xhtml: true,
  hash: true,
  siteConfig: JSON.stringify(siteConfig),
  overlayMessage
})

const copyStaticFilesConfig = new CopyWebpackPlugin(
  [{
    from: 'locales',
    to: 'locales'
  }],
  {copyUnmodified: true}
)

module.exports = {
  context: appPath,
  entry: [
    'babel-polyfill',
    'isomorphic-fetch',
    './style.styl',
    './index'
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: appPath,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [['es2015', {/* modules: false */}], 'stage-1', 'react'],
            plugins: ['transform-decorators-legacy']
          }
        }]
      },
      {
        test: /\.css$/,
        include: appPath,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.styl$/,
        include: appPath,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
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
