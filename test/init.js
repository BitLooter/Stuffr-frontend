require('isomorphic-fetch')
require('babel-polyfill')

var optionsGenerator = require('../webpack.config.js')
var options = optionsGenerator({testing: true})

// Specify Babel options for testing
var register = require('babel-core/register')
// babel-plugin-rewire is used for __GetDependency__, to get functions that
// have not been exported to test them
options.module.rules[1].use[0].options.plugins =
  options.module.rules[1].use[0].options.plugins.concat(['babel-plugin-rewire'])
register(options.module.rules[1].use[0].options)

var log = require('loglevel')
log.setLevel(log.levels.SILENT)

global.siteConfig = {prefix: 'TEST'}
