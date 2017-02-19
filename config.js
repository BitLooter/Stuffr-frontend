// This file merges the default configuration into the local configuration. To
// set up a local configuration, copy config.default.js to config.local.js and
// change whatever settings you need to.

const defaultConfig = require('./config.default')

let localConfig = {}
try {
  localConfig = require('./config.local')
} catch (e) {
  // No local config exists, ignore
}

const config = Object.assign({}, defaultConfig, localConfig)

module.exports = config
