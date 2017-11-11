const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const InlineChunkWebpackPlugin = require('html-webpack-inline-chunk-plugin')

const appConfig = require('./config')
// Need package.json to get current version
const packageConfig = require('./package.json')

const appPath = path.join(__dirname, '/app')
const vendorModules = ['react']
let fonts
if (appConfig.fontSource === 'local') {
  fonts = ['fonts/roboto.css']
} else if (appConfig.fontSource === 'google') {
  fonts = ['https://fonts.googleapis.com/css?family=Roboto:400,300,500']
} else {
  // Just need webpack to show an error
  // eslint-disable-next-line
  throw `Unknown font source '${appConfig.fontSource}'. App config is broken.`
}

// Load info to display over webpage, if any. Useful for displaying reminders
// about which environment the page is running from, e.g. dev or test server.
let overlayMessage
try {
  // eslint-disable-next-line no-sync
  overlayMessage = fs.readFileSync(path.join(__dirname, '/overlay.html'))
} catch (e) {
  // No overlay.html file, ignore error
}

const siteConfig = {
  apiPath: appConfig.apiPath,
  authPath: appConfig.authPath,
  logLevel: appConfig.logLevel,
  frontendVersion: packageConfig.version
}

const htmlWebpackPluginMainConfig = new HtmlWebpackPlugin({
  title: 'Stuffr',
  description: 'Stuffr helps you keep track of your things',
  template: path.join(__dirname, '/app/common/app.ejs'),
  chunks: ['manifest', 'vendor', 'main'],
  xhtml: true,
  siteConfig: JSON.stringify({prefix: 'MAIN', ...siteConfig}),
  fonts,
  overlayMessage
})
const htmlWebpackPluginAdminConfig = new HtmlWebpackPlugin({
  filename: 'admin/index.html',
  title: 'Stuffr Admin',
  description: 'Admin page for Stuffr',
  template: path.join(__dirname, '/app/common/app.ejs'),
  chunks: ['manifest', 'vendor', 'admin/main'],
  xhtml: true,
  siteConfig: JSON.stringify({prefix: 'ADMIN', ...siteConfig}),
  fonts,
  overlayMessage
})

const copyStaticFilesConfig = new CopyWebpackPlugin(
  [
    {from: 'locales', to: 'locales'},
    {from: 'fonts', to: 'fonts', context: __dirname, ignore: ['*.ttf', '*.txt']}
  ],
  {copyUnmodified: true}
)

// Common base config that will be modified depending on build environment
const config = {
  context: appPath,
  module: {
    rules: [{
      test: /\.js?$/,
      include: appPath,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [['env', {modules: false}], 'stage-2', 'react'],
          plugins: []
        }
      }]
    }]
  },
  resolve: {
    modules: [
      path.join(__dirname, 'app'),
      'node_modules'
    ]
  },
  entry: {
    'main': [
      'babel-polyfill',
      'isomorphic-fetch',
      './main/index'
    ],
    'admin/main': [
      // TODO: test if a polyfill is still needed on modern browsers
      'babel-polyfill',
      './admin/index'
    ],
    vendor: vendorModules
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/dist')
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.NamedChunksPlugin(),
    // Named modules smaller than HashedModuleIdsPlugin after gzip
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest'],
      minChunks: Infinity}),
    htmlWebpackPluginMainConfig,
    htmlWebpackPluginAdminConfig,
    copyStaticFilesConfig
  ]
}

module.exports = (env) => {
  // PRODUCTION SETTINGS
  // ===================
  if (env && env.production) {
    const CompressionPlugin = require('compression-webpack-plugin')

    const CompressionPluginConfig = new CompressionPlugin({
      algorithm: 'gzip',
      threshold: 4096
    })

    config.devtool = 'cheap-module-source-map'
    config.output.filename = '[name].[chunkhash].js'
    config.plugins.push(CompressionPluginConfig)
    config.plugins.push(new InlineChunkWebpackPlugin({
      inlineChunks: ['manifest']
    }))

  // DEVELOPMENT SETTINGS
  // ====================
  } else {
    // Node STILL doesn't properly support modules, so enable Babel's module
    // handling while testing
    if (env.testing) {
      config.module.rules[0].use[0].options.presets[0][1].modules = 'commonjs'
    }

    config.devtool = 'eval-source-map'

    // Enable hot reloading
    config.module.rules[0].use[0].options.plugins.unshift('react-hot-loader/babel')
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
    config.entry['main'].splice(1, 0, 'react-hot-loader/patch')
    config.entry['admin/main'].splice(1, 0, 'react-hot-loader/patch')

    // Dev server config. Check local app config to change options.
    const backendUrl = `http://${appConfig.devProxyHost}:${appConfig.devProxyPort}`
    config.devServer = {
      host: appConfig.devServerHost,
      port: appConfig.devServerPort,
      contentBase: './dist',
      hot: true,
      proxy: {
        '/api': backendUrl,
        '/auth': backendUrl
      },
      overlay: {
        warnings: true,
        errors: true
      }
    }

    // Run linter on build
    config.module.rules.unshift({
      test: /\.js?$/,
      include: appPath,
      enforce: 'pre',
      loader: 'eslint-loader'
    })
  }
  return config
}
