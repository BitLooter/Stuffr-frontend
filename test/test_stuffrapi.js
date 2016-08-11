/* eslint-env mocha */

import {expect} from 'chai'
import nock from 'nock'

import { StuffrApi } from '../app/stuffrapi'

const TEST_DOMAIN = 'https://example.com'

describe('Stuffr API wrapper', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('/things (GET)', async () => {
    const testThings = [
      {id: 1, name: 'THING1'},
      {id: 2, name: 'THING2'}
    ]
    const thingsScope = nock(TEST_DOMAIN)
      .get('/things')
      .reply(200, testThings)

    const api = new StuffrApi(TEST_DOMAIN)
    const things = await api.getThings()
    expect(things).to.eql(testThings)
    thingsScope.done()
  })

  it('/things (POST)', async () => {
    const newThing = [
      {name: 'NEWTHING'}
    ]
    const expectedResponse = {
      id: 42
    }
    const testScope = nock(TEST_DOMAIN)
      .post('/things', newThing)
      .reply(201, expectedResponse)

    const api = new StuffrApi(TEST_DOMAIN)
    const thingResponse = await api.addThing(newThing)
    expect(thingResponse).to.eql(expectedResponse)
    testScope.done()
  })
})
