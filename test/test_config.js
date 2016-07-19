import 'babel-polyfill'
import {expect} from 'chai'
import {ConfigError, __GetDependency__} from '../app/config'

const defaultConfig = __GetDependency__('defaultConfig')
const checkConfig = __GetDependency__('checkConfig')

describe('Configuration handling:', () => {
  it('Default configuration valid', () => {
    expect(() => checkConfig(defaultConfig)).to.not.throw(ConfigError)
  })
  it('Detects invalid configuration', () => {
    let badConfig = {...defaultConfig}
    function runConfigCheck () { checkConfig(badConfig) }

    delete badConfig.API_PATH
    expect(runConfigCheck).to.throw(Error)
    
    badConfig = {...defaultConfig, API_PATH: 1}
    expect(runConfigCheck).to.throw(Error)
  })
})
