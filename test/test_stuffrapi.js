/* eslint-env mocha */

import {expect} from 'chai'
import fetchMock from 'fetch-mock'

import {StuffrApi} from '../app/stuffrapi'
import {TEST_DOMAIN, testThings, newThing, newThingId} from './dummydata'

const THINGS_URL = `${TEST_DOMAIN}/things`

describe('Stuffr API wrapper', () => {
  let api
  beforeEach(() => {
    api = new StuffrApi(TEST_DOMAIN)
  })
  afterEach(() => {
    api = undefined
    fetchMock.restore()
  })

  it('/things (GET)', async () => {
    fetchMock.get(THINGS_URL, testThings)
    const things = await api.getThings()
    expect(things).to.eql(testThings)
    expect(fetchMock.called(THINGS_URL)).to.be.true
  })

  it('/things (POST)', async () => {
    const expectedResponse = {
      id: newThingId
    }
    fetchMock.post(THINGS_URL, {
      status: 201,
      body: expectedResponse
    })
    const thingResponse = await api.addThing(newThing)
    expect(thingResponse).to.eql(expectedResponse)
    expect(fetchMock.called(THINGS_URL)).to.be.true
  })
})
