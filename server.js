/* Webpack development server setup.

Run `node server.js` to get the dev server going. You can change the address
and port it binds to in the local configuration file.
*/
/* eslint no-console: "off" */

const WebpackDevServer = require('webpack-dev-server')
const Webpack = require('webpack')
const config = require('./config')
const webpackConfig = require('./webpack.config')

const compiler = Webpack(webpackConfig)
const backendUrl = `http://${config.devProxyHost}:${config.devProxyPort}`
const server = new WebpackDevServer(compiler, {
  hot: true,
  compress: true,
  proxy: {
    '/api': backendUrl,
    '/auth': backendUrl
  },
  clientLogLevel: 'info',
  stats: { colors: true }
})

console.log('Stuffr development server. NOT FOR PRODUCTION USE.')
console.log(`Server starting at ${config.devServerHost}:${config.devServerPort}...`)
server.listen(config.devServerPort, config.devServerHost)
