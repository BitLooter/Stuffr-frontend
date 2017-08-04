const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const appConfig = require('./config')
// Need package.json to get current version
const packageConfig = require('./package.json')

const appPath = path.join(__dirname, '/app')

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
  template: path.join(__dirname, '/app/app.ejs'),
  chunks: ['main'],
  xhtml: true,
  hash: true,
  description: 'Stuffr helps you keep track of your things',
  siteConfig: JSON.stringify(siteConfig),
  overlayMessage
})
const htmlWebpackPluginAdminConfig = new HtmlWebpackPlugin({
  filename: 'admin/index.html',
  title: 'Stuffr Admin',
  template: path.join(__dirname, '/app/app.ejs'),
  chunks: ['admin/main'],
  xhtml: true,
  hash: true,
  description: 'Admin page for Stuffr',
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

// Common base config that will be modified depending on build environment
const config = {
  context: appPath,
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: appPath,
        use: [{
          loader: 'babel-loader',
          options: {
            // TODO: modules: false incompatible with HMR, uncomment when fixed
            presets: [['es2015', {/* modules: false */}], 'stage-1', 'react'],
            plugins: ['transform-decorators-legacy']
          }
        }]
      }
    ]
  },
  entry: {
    main: [
      'babel-polyfill',
      'isomorphic-fetch',
      './index'
    ],
    'admin/main': [
      // TODO: test if a polyfill is still needed on modern browsers
      'babel-polyfill',
      './admin/index'
    ]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/dist')
  },
  plugins: [
    htmlWebpackPluginMainConfig,
    htmlWebpackPluginAdminConfig,
    copyStaticFilesConfig
  ]
}

module.exports = (env) => {
  if (env && env.production) {
    const CompressionPlugin = require('compression-webpack-plugin')

    const CompressionPluginConfig = new CompressionPlugin({
      algorithm: 'gzip',
      threshold: 4096
    })

    config.devtool = 'cheap-module-source-map'
    config.plugins.push(CompressionPluginConfig)
  } else { // Else development build
    config.devtool = 'eval-source-map'

    // Enable hot reloading
    const devServerEntryPoints = ['main', 'admin/main']
    for (const entryPoint of devServerEntryPoints) {
      config.entry[entryPoint].splice(-1, 0,
        `webpack-dev-server/client?http://${appConfig.publicServerHost}:${appConfig.publicServerPort}`,
        'webpack/hot/only-dev-server')
    }
    config.module.rules[0].use.unshift({loader: 'react-hot-loader'})
    config.plugins.push(new webpack.HotModuleReplacementPlugin())

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

    // Named modules make code splitting, HMR, etc. easier
    config.plugins.push(new webpack.NamedModulesPlugin())

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
