// Specify Babel options for testing
require('babel-polyfill')
require('isomorphic-fetch')
var register = require('babel-core/register')
var options = require('../webpack.config.js')
options.module.loaders[0].query.plugins = ['babel-plugin-rewire']
register(options.module.loaders[0].query)
