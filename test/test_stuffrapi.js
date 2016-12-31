/* eslint-env mocha */

import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import 'mocha-sinon'
import fetchMock from 'fetch-mock'
import HttpStatus from 'http-status'

import {createStuffrApi} from '../app/stuffrapi'
import {TEST_DOMAIN, TEST_USER, TEST_INVENTORIES, TEST_THINGS,
        NEW_INVENTORY, NEW_THING, NEW_INVENTORY_ID, NEW_THING_ID}
        from './dummydata'

const TEST_INVENTORY_ID = 1
const INVENTORIES_URL = `${TEST_DOMAIN}/inventories`
const INVENTORIES_THINGS_URL = `${INVENTORIES_URL}/${TEST_INVENTORY_ID}/things`
const THINGS_URL = `${TEST_DOMAIN}/things`

chai.use(chaiAsPromised)

describe('Stuffr API wrapper:', () => {
  let api
  beforeEach(() => {
    api = createStuffrApi(TEST_DOMAIN)
  })
  afterEach(() => {
    api = undefined
    fetchMock.restore()
  })

  describe('Generic request method:', () => {
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

    it('Throws error on unauthenticated', () => {
      fetchMock.get(`${TEST_DOMAIN}/test401`, HttpStatus.UNAUTHORIZED, {name: '401_TEST'})
      return expect(api._request('/test401')).to.be.rejected
    })
  })

  it('/userinfo (GET)', async () => {
    const url = `${TEST_DOMAIN}/userinfo`
    fetchMock.get(url, TEST_USER)
    const userInfo = await api.getUserInfo()
    expect(fetchMock.called(url)).to.be.true
    expect(userInfo).to.eql(TEST_USER)
  })

  it('/inventories (GET)', async () => {
    fetchMock.get(INVENTORIES_URL, TEST_INVENTORIES)
    const inventories = await api.getInventories()
    expect(fetchMock.called(INVENTORIES_URL)).to.be.true
    expect(inventories).to.eql(TEST_INVENTORIES)
  })

  it('/inventories (POST)', async () => {
    const expectedResponse = {
      id: NEW_INVENTORY_ID
    }
    fetchMock.post(INVENTORIES_URL, {
      status: HttpStatus.CREATED,
      body: expectedResponse
    })
    const response = await api.addInventory(NEW_INVENTORY)
    expect(fetchMock.called(INVENTORIES_URL)).to.be.true
    expect(response).to.eql(expectedResponse)
  })

  it('/inventories/<inv_id>/things (GET)', async () => {
    fetchMock.get(INVENTORIES_THINGS_URL, TEST_THINGS)
    const expectedThings = TEST_THINGS
    const things = await api.getThings(TEST_INVENTORY_ID)
    expect(fetchMock.called(INVENTORIES_THINGS_URL)).to.be.true
    expect(things).to.eql(expectedThings)
  })

  it('/inventories/<inv_id>/things (POST)', async () => {
    const expectedResponse = {
      id: NEW_THING_ID
    }
    fetchMock.post(INVENTORIES_THINGS_URL, {
      status: HttpStatus.CREATED,
      body: expectedResponse
    })
    const thingResponse = await api.addThing(TEST_INVENTORY_ID, NEW_THING)
    expect(fetchMock.called(INVENTORIES_THINGS_URL)).to.be.true
    expect(thingResponse).to.eql(expectedResponse)
  })

  it('/things/<id> (PUT)', async () => {
    const thingId = 3
    const thingsUrlWithId = `${THINGS_URL}/${thingId}`
    fetchMock.put(thingsUrlWithId, {
      status: HttpStatus.NO_CONTENT
    })
    const thingResponse = await api.updateThing(thingId, NEW_THING)
    expect(fetchMock.called(thingsUrlWithId)).to.be.true
    expect(thingResponse).to.be.null
  })

  it('/things/<id> (DELETE)', async () => {
    const thingId = 3
    const thingsUrlWithId = `${THINGS_URL}/${thingId}`
    fetchMock.delete(thingsUrlWithId, {
      status: HttpStatus.NO_CONTENT
    })
    const thingResponse = await api.deleteThing(thingId)
    expect(fetchMock.called(thingsUrlWithId)).to.be.true
    expect(thingResponse).to.be.null
  })
})
