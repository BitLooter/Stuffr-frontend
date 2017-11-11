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
  constructor (baseUrl, authBaseUrl, token) {
    if (baseUrl.endsWith('/')) {
      // Strip trailing slash
      baseUrl = baseUrl.replace(/\/$/, '')
    }
    this.urlBase = baseUrl
    if (authBaseUrl.endsWith('/')) {
      // Strip trailing slash
      authBaseUrl = authBaseUrl.replace(/\/$/, '')
    }
    this.authUrlBase = authBaseUrl

    if (token) {
      this.token = token
    } else {
      this.token = null
    }
  }

  // GET request to /serverinfo
  async getServerInfo (callback) {
    log.debug('StuffrApi: Request for getServerInfo')
    return this._request('/serverinfo', {callback})
  }

  // GET request to /userinfo
  async getUserInfo (callback) {
    log.debug('StuffrApi: Request for getUserInfo')
    return this._request('/userinfo', {callback})
  }

  // GET request to /inventories
  async getInventories (callback) {
    // TODO: server does not seem to produce any errors if no inventories exist, fix that.
    log.debug('StuffrApi: Request for getInventories')
    return this._request('/inventories', {callback})
  }

  // POST request to /inventories
  async addInventory (inventoryData, callback) {
    log.debug('StuffrApi: Request for addInventory')
    return this._request('/inventories',
      {parameters: inventoryData, callback})
  }

  // GET request to /inventories/<inventory_id>/things
  async getThings (inventoryId, callback) {
    log.debug('StuffrApi: Request for getThings')
    return this._request(`/inventories/${inventoryId}/things`, {callback})
  }

  // POST request to /inventories/<inventory_id>/things
  async postThing (thingData, inventoryId, callback) {
    log.debug('StuffrApi: Request for postThing')
    return this._request(`/inventories/${inventoryId}/things`,
      {parameters: thingData, callback})
  }

  // PUT request to /things/<id>
  async putThing (thingId, thingData, callback) {
    log.debug(`StuffrApi: Request for putThing <${thingId}>`)
    return this._request(`/things/${thingId}`,
      {method: 'PUT',
        parameters: thingData,
        callback})
  }

  // DELETE request to /things/<id>
  async deleteThing (thingId, callback) {
    log.debug(`StuffrApi: Request for deleteThing <${thingId}>`)
    return this._request(`/things/${thingId}`,
      {method: 'DELETE',
        callback})
  }

  // Authenticate with server
  async login (email, password) {
    log.debug(`StuffrApi: Logging in user ${email}`)
    // TODO: Stop session cookie generation
    const loginInfo = {email, password}
    const response = await this._request('/login', {parameters: loginInfo,
      requestUrlBase: this.authUrlBase})
    // TODO: better error handling
    // TODO: Flask-Security is leaking user data with too much info in errors, fix that
    if (response.meta.code === HttpStatus.OK) {
      this.token = response.response.user.authentication_token
    } else if (response.meta.code === HttpStatus.BAD_REQUEST) {
      throw new Error('Bad username or password')
    } else {
      throw new Error('Unknown error logging in')
    }
    log.info(`StuffrApi: Successfully logged in user ${email}`)
  }

  // Log out and purge local user data
  logout () {
    // TODO: make a request to /logout
    this.token = null
    log.info('StuffrApi: Logged out user')
  }

  async registerUser (newUserInfo) {
    log.debug(`StuffrApi: Registering new user ${newUserInfo.email}`)
    const response = await this._request('/register',
      {parameters: newUserInfo,
        requestUrlBase: this.authUrlBase})
    // TODO: better error handling
    if (response.meta.code === HttpStatus.OK) {
      this.token = response.response.user.authentication_token
    } else {
      const responseErrors = response.response.errors
      let msg
      if (responseErrors.email) {
        msg = responseErrors.email
      } else if (responseErrors.password) {
        msg = responseErrors.password
      } else {
        msg = 'Unknown error registering'
      }
      throw new Error(`Register: ${msg}`)
    }
    log.info(`StuffrApi: Successfully registered new user ${newUserInfo.email}`)
  }

  /* Admin calls
   **************/
  async adminGetStats (callback) {
    log.info('StuffrApi: (Admin) Request for server stats')
    return this._request('/admin/stats', {callback})
  }

  async adminGetUsers (callback) {
    log.info('StuffrApi: (Admin) Request for user list')
    return this._request('/admin/users', {callback})
  }

  /* Utility methods
   ******************/

  // Makes request to the server specified in baseUrl
  async _request (path, {method, parameters, requestUrlBase, callback} = {}) {
    const urlBase = requestUrlBase || this.urlBase
    const headers = new Headers()
    const body = JSON.stringify(parameters)
    const fullUrl = urlBase + path
    log.trace(`StuffrApi: Generic request to ${fullUrl}`)

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
      log.error(`StuffrApi: Error fetching ${fullUrl}: ${error}`)
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
export function createStuffrApi (baseUrl, authBaseUrl, token) {
  log.trace(`StuffrApi: Created new API object for ${baseUrl}`)
  return new StuffrApi(baseUrl, authBaseUrl, token)
}

// Dummy object to throw an error if the API was used before initalization
const dummyApi = {
  get (target, name) {
    const errorMsg = 'StuffrApi: You must call setupApi before using API functions'
    log.error(errorMsg)
    throw new Error(errorMsg)
  }
}
let defaultApi = new Proxy({}, dummyApi)
export {defaultApi as default}

// Proxy API that does nothing, useful for testing
const nullApi = {
  get (target, name) {
    log.debug(`nullApi get: target=${target}, name=${name}`)
    return () => {}
  }
}
const nullApiProxy = new Proxy({}, nullApi)
export function setNullApi () {
  defaultApi = nullApiProxy
}

/* Prepares the default API object for use. If you need to handle your own API
   object, use createStuffrApi instead. */
export function setupApi (baseUrl, authBaseUrl, token) {
  log.info(`StuffrApi: Created new default API object for ${baseUrl}`)
  defaultApi = createStuffrApi(baseUrl, authBaseUrl, token)
}
