/* eslint-env mocha */

import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import 'mocha-sinon'
import fetchMock from 'fetch-mock'
import HttpStatus from 'http-status'

import {StuffrApi} from '../app/stuffrapi'
import {TEST_DOMAIN, testThings, newThing, newThingId} from './dummydata'

const THINGS_URL = `${TEST_DOMAIN}/things`

chai.use(chaiAsPromised)

describe('Stuffr API wrapper:', () => {
  let api
  beforeEach(() => {
    api = new StuffrApi(TEST_DOMAIN)
  })
  afterEach(() => {
    api = undefined
    fetchMock.restore()
  })

  describe('Generic request method', () => {
    it('Basic GET request', async function () {
      fetchMock.get(`${TEST_DOMAIN}/testget`, ['GET_TEST'], {name: 'GET_TEST'})
      const response = await api._request('/testget')
      expect(fetchMock.called('GET_TEST')).to.be.true
      expect(response).to.eql(['GET_TEST'])
    })

    it('Autodetect POST', async function () {
      const TEST_DATA = {testParam: 'testData'}

      fetchMock.post(`${TEST_DOMAIN}/testpost`, ['POST_TEST'], {name: 'POST_TEST'})
      const response = await api._request('/testpost', {parameters: TEST_DATA})
      expect(fetchMock.called('POST_TEST')).to.be.true
      expect(response).to.eql(['POST_TEST'])
    })

    it('Specify custom method', async function () {
      const TEST_DATA = {testParam: 'testData'}

      fetchMock.put(`${TEST_DOMAIN}/testput`, ['PUT_TEST'], {name: 'PUT_TEST'})
      const response = await api._request('/testput', {
        method: 'PUT',
        parameters: TEST_DATA
      })
      expect(fetchMock.called('PUT_TEST')).to.be.true
      expect(response).to.eql(['PUT_TEST'])
    })

    it('Response with no data (HTTP 204)', async function () {
      fetchMock.get(`${TEST_DOMAIN}/test204`, HttpStatus.NO_CONTENT)
      const response = await api._request('/test204')
      expect(fetchMock.called(`${TEST_DOMAIN}/test204`)).to.be.true
      expect(response).to.be.null
    })

    it('Callback function', async function () {
      fetchMock.get(`${TEST_DOMAIN}/testcallback`, ['CALLBACK_TEST'], {name: 'CALLBACK_TEST'})
      const callbackSpy = this.sinon.spy()
      const response = await api._request('/testcallback', {
        callback: callbackSpy
      })
      expect(fetchMock.called('CALLBACK_TEST')).to.be.true
      expect(response).to.eql(['CALLBACK_TEST'])
      expect(callbackSpy.calledWith(['CALLBACK_TEST'])).to.be.true
    })

    it('Throws error on 404', () => {
      fetchMock.get(`${TEST_DOMAIN}/test404`, HttpStatus.NOT_FOUND, {name: '404_TEST'})
      return expect(api._request('/test404')).to.be.rejected
    })

    it('Throws error on 500', () => {
      fetchMock.get(`${TEST_DOMAIN}/test500`, HttpStatus.INTERNAL_SERVER_ERROR, {name: '500_TEST'})
      return expect(api._request('/test500')).to.be.rejected
    })
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

  it('/things/<id> (PUT)', async () => {
    const thingId = 3
    const thingsUrlWithId = `${THINGS_URL}/${thingId}`
    fetchMock.put(thingsUrlWithId, {
      status: 204
    })
    const thingResponse = await api.updateThing(thingId, newThing)
    expect(thingResponse).to.be.null
    expect(fetchMock.called(thingsUrlWithId)).to.be.true
  })

  it('/things/<id> (DELETE)', async () => {
    const thingId = 3
    const thingsUrlWithId = `${THINGS_URL}/${thingId}`
    fetchMock.delete(thingsUrlWithId, {
      status: 204
    })
    const thingResponse = await api.deleteThing(thingId)
    expect(thingResponse).to.be.null
    expect(fetchMock.called(thingsUrlWithId)).to.be.true
  })
})
