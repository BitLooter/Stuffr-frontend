import log from 'loglevel'

export class StuffrApi {
  constructor (baseUrl) {
    if (!baseUrl.endsWith('/')) {
      baseUrl = `${baseUrl}/`
    }
    this.urlBase = baseUrl
  }

  // GET request to /things
  async getThings (callback) {
    log.info('StuffrApi request for getThings')
    return await this._request('things', {callback})
  }

  // POST request to /things
  async addThing (parameters, callback) {
    log.info('StuffrApi request for addThing')
    return await this._request('things', {method: 'POST', parameters, callback})
  }

  // Makes request to the server specified in baseUrl
  async _request (path, {method = 'GET', parameters, callback} = {}) {
    // TODO: Autodetect method based on presence of parameters
    const headers = new Headers()
    const body = JSON.stringify(parameters)
    const fullUrl = this.urlBase + path
    log.trace(`StuffrApi generic request to ${fullUrl}`)
    // Default method is GET, POST if paramater data is given
    if (method === 'POST' || method === 'PUT') {
      headers.append('Content-Type', 'application/json')
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
      throw new Error(`Error: HTTP response ${response.status} '${response.statusText}' fetching ${fullUrl}`)
    }

    const returnValue = await response.json()
    if (callback !== undefined) {
      callback(returnValue)
    }
    return returnValue
  }
}
