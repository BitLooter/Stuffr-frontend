// Specify Babel options for testing
require('babel-polyfill')
require('isomorphic-fetch')
var register = require('babel-core/register')
var log = require('loglevel')
log.setLevel(log.levels.SILENT)
var optionsGenerator = require('../webpack.config.js')
var options = optionsGenerator({production: true})
options.module.rules[0].use[0].options.plugins =
  options.module.rules[0].use[0].options.plugins.concat(['babel-plugin-rewire'])
register(options.module.rules[0].use[0].options)
