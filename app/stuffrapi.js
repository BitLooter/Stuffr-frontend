/* stuffrapi.js
Abstraction for working with Stuffr's backend REST API.

An API object is exported for use in programs. To use, call the setupApi
function at some point before it in your code, then whereever you need to call
the Stuffr backend API you can just "import stuffrApi from 'stuffrapi'" to
access it.

For more complicated setups or if you prefer to manage the API object yourself,
use the createStuffrApi function, which returns a new instance of the StuffrApi
class.
********************************************************************/

import HttpStatus from 'http-status'
import log from 'loglevel'
// TODO: do not import loglevel but take a log object on createStuffrApi

class StuffrApi {
  constructor (baseUrl, token) {
    if (baseUrl.endsWith('/')) {
      // Strip trailing slash
      baseUrl = baseUrl.replace(/\/$/, '')
    }
    this.urlBase = baseUrl
    if (token) {
      this.token = token
    } else {
      this.token = null
    }
  }

  // GET request to /userinfo
  async getUserInfo (callback) {
    log.info('StuffrApi request for getUserInfo')
    return await this._request('/userinfo', {callback})
  }

  // GET request to /inventories
  async getInventories (callback) {
    // TODO: server does not seem to produce any errors if no inventories
    // exist, fix that.
    log.info('StuffrApi request for getInventories')
    return await this._request('/inventories', {callback})
  }

  // POST request to /inventories
  async addInventory (inventoryData, callback) {
    log.info('StuffrApi request for addInventory')
    return await this._request('/inventories',
        {parameters: inventoryData, callback})
  }

  // GET request to /inventories/<inventory_id>/things
  async getThings (inventoryId, callback) {
    log.info('StuffrApi request for getThings')
    return await this._request(`/inventories/${inventoryId}/things`, {callback})
  }

  // POST request to /things
  async addThing (inventoryId, thingData, callback) {
    log.info('StuffrApi request for addThing')
    return await this._request(`/inventories/${inventoryId}/things`,
        {parameters: thingData, callback})
  }

  // PUT request to /things/<id>
  async updateThing (thingId, thingData, callback) {
    log.info(`StuffrApi request for updateThing <${thingId}>`)
    return await this._request(`/things/${thingId}`,
        {method: 'PUT',
         parameters: thingData,
         callback})
  }

  // DELETE request to /things/<id>
  async deleteThing (thingId, callback) {
    log.info(`StuffrApi request for deleteThing <${thingId}>`)
    return await this._request(`/things/${thingId}`,
        {method: 'DELETE',
         callback})
  }

  // Authenticate with server
  async login (email, password) {
    // TODO: Stop session cookie generation

    const loginInfo = {email, password}
    const response = await this._request('/login', {parameters: loginInfo,
                                                    requestUrlBase: '/auth'})
    // TODO: error handling
    this.token = response.response.user.authentication_token
  }

  // Makes request to the server specified in baseUrl
  async _request (path, {method, parameters, requestUrlBase, callback} = {}) {
    const urlBase = requestUrlBase || this.urlBase
    const headers = new Headers()
    const body = JSON.stringify(parameters)
    const fullUrl = urlBase + path
    log.trace(`StuffrApi generic request to ${fullUrl}`)

    // Determine method if not given in parameters
    // Default method is GET, POST if paramater data is given
    if (!method) {
      if (parameters) {
        method = 'POST'
      } else {
        method = 'GET'
      }
    }
    if (method === 'POST' || method === 'PUT') {
      headers.append('Content-Type', 'application/json')
    }

    headers.append('Accept', 'application/json')
    if (this.token) {
      headers.append('Authentication-Token', this.token)
    }

    let response
    try {
      response = await fetch(fullUrl, {method, headers, body})
    } catch (error) {
      // Throw a more useful error message than the default
      log.error(`Error fetching ${fullUrl}: ${error}`)
      throw new Error(`Unable to fetch ${fullUrl}`)
    }
    if (!response.ok) {
      const message = `HTTP response ${response.status} '${response.statusText}' fetching ${fullUrl}`
      const e = new Error(message)
      e.status = response.status
      throw e
    }

    let returnValue
    if (response.status === HttpStatus.NO_CONTENT) {
      // 204 means request was successful but did not return any data
      returnValue = null
    } else {
      returnValue = await response.json()
    }

    if (callback !== undefined) {
      callback(returnValue)
    }
    return returnValue
  }
}

// Factory function for creating StuffrApi objects
export function createStuffrApi (baseUrl, token) {
  return new StuffrApi(baseUrl, token)
}

// Dummy object to throw an error if the API was used before initalization
const dummyApi = {
  get (target, name) {
    const errorMsg = 'You must call setupApi before using API functions'
    log.error(errorMsg)
    throw new Error(errorMsg)
  }
}

let defaultApi = new Proxy({}, dummyApi)
export {defaultApi as default}

export function setupApi (baseUrl, token) {
  defaultApi = createStuffrApi(baseUrl, token)
}
