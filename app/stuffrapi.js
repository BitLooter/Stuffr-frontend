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
  constructor (baseUrl) {
    if (baseUrl.endsWith('/')) {
      // Strip trailing slash
      baseUrl = baseUrl.replace(/\/$/, '')
    }
    this.urlBase = baseUrl
  }

  // GET request to /inventories
  async getInventories (callback) {
    log.info('StuffrApi request for getInventories')
    return await this._request('/inventories', {callback})
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

  // Makes request to the server specified in baseUrl
  async _request (path, {method, parameters, callback} = {}) {
    const headers = new Headers()
    const body = JSON.stringify(parameters)
    const fullUrl = this.urlBase + path
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
    let response
    try {
      response = await fetch(fullUrl, {method, headers, body})
    } catch (error) {
      // Throw a more useful error message than the default
      log.error(`Error fetching ${fullUrl}: ${error}`)
      throw new Error(`Unable to fetch ${fullUrl}`)
    }
    if (!response.ok) {
      throw new Error(`HTTP response ${response.status} '${response.statusText}' fetching ${fullUrl}`)
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
export function createStuffrApi (baseUrl) {
  return new StuffrApi(baseUrl)
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

export function setupApi (baseUrl) {
  defaultApi = createStuffrApi(baseUrl)
}
