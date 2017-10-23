// Specify Babel options for testing
require('babel-polyfill')
require('isomorphic-fetch')
var register = require('babel-core/register')
var log = require('loglevel')
log.setLevel(log.levels.SILENT)
var optionsGenerator = require('../webpack.config.js')
var options = optionsGenerator({production: true})
// babel-plugin-rewire is used for __GetDependency__, to get functions that
// have not been export to test them
options.module.rules[0].use[0].options.plugins =
  options.module.rules[0].use[0].options.plugins.concat(['babel-plugin-rewire'])
register(options.module.rules[0].use[0].options)
