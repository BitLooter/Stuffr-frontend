/* eslint-env mocha */

import 'babel-polyfill'
import 'isomorphic-fetch'
import {expect} from 'chai'
import nock from 'nock'

import { StuffrApi } from '../app/stuffrapi'

describe('Stuffr API wrapper', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('/things', async () => {
    const testThings = [
      {id: 1, name: 'THING1'},
      {id: 2, name: 'THING2'}
    ]
    const thingsScope = nock('https://example.com')
      .get('/things')
      .reply(200, testThings)

    const api = new StuffrApi('https://example.com')
    const things = await api.getThings()
    expect(things).to.eql(testThings)
    thingsScope.done()
  })
})
