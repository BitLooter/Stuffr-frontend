const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const appPath = path.join(__dirname, '/app')

const defaultConfig = {
  apiPath: '/api',
  authPath: '/auth'
}

let overlayMessage
try {
  // eslint-disable-next-line no-sync
  overlayMessage = fs.readFileSync(path.join(__dirname, '/overlay.html'))
} catch (e) {
  // No overlay.html file, ignore error
}

let localConfig = defaultConfig
if (process.env.NODE_ENV) {
  try {
    localConfig = require(`config.${process.env.NODE_ENV}.js`)
  } catch (e) {
    // No local config exists, ignore
  }
}
// TODO: use spread operator when available, general cleanup
const siteConfig = {
  apiPath: localConfig.apiPath || defaultConfig.apiPath,
  authPath: localConfig.authPath || defaultConfig.authPath
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
  devtool: 'eval-source-map',
  context: appPath,
  entry: [
    'babel-polyfill',
    'isomorphic-fetch',
    './style.styl',
    './index.js'
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: appPath,
        enforce: 'pre',
        loader: 'eslint-loader'
      },
      {
        test: /\.js?$/,
        include: appPath,
        loader: 'babel-loader',
        options: {
          presets: [['es2015'], 'stage-1', 'react'],
          plugins: ['transform-decorators-legacy']
          // modules: false
        }
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
