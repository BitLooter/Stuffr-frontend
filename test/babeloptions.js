// Specify Babel options for testing
require('babel-core/register')({
  presets: ['es2015', 'stage-1'],
  plugins: ['babel-plugin-rewire']
})
