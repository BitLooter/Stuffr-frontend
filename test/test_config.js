/* eslint-env mocha */

import {expect} from 'chai'
import fetchMock from 'fetch-mock'

import {ConfigError, __GetDependency__} from '../app/config'
const defaultConfig = __GetDependency__('defaultConfig')
const checkConfig = __GetDependency__('checkConfig')
const getLocalConfig = __GetDependency__('getLocalConfig')

const CONFIG_FILE = 'configlocal.json'

describe('Configuration handling:', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('Fetch configuration file', async () => {
    const expectedConfig = {test: 'TEST'}
    fetchMock.mock(CONFIG_FILE, expectedConfig)
    const testConfig = await getLocalConfig()
    expect(fetchMock.called(CONFIG_FILE)).to.be.true
    expect(testConfig).to.eql(expectedConfig)
  })

  it('Default configuration valid', () => {
    expect(() => checkConfig(defaultConfig)).to.not.throw(ConfigError)
  })

  it('Detects invalid configuration', () => {
    let badConfig = {...defaultConfig}

    delete badConfig.API_PATH
    expect(() => checkConfig(badConfig)).to.throw(Error)

    badConfig = {...defaultConfig, API_PATH: 1}
    expect(() => checkConfig(badConfig)).to.throw(Error)
  })
})
