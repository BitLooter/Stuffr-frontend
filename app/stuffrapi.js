export class StuffrApi {
  constructor (baseUrl) {
    if (!baseUrl.endsWith('/')) {
      baseUrl = `${baseUrl}/`
    }
    this.urlBase = baseUrl
  }

  // GET request to /things
  async getThings (callback) {
    return await this._request('things', {callback})
  }

  // POST request to /things
  async addThing (parameters, callback) {
    return await this._request('things', {method: 'POST', parameters, callback})
  }

  // Makes request to the server specified in baseUrl
  async _request (path, {method = 'GET', parameters, callback} = {}) {
    // TODO: Autodetect method
    const headers = new Headers()
    const body = JSON.stringify(parameters)
    if (method === 'POST' || method === 'PUT') {
      headers.append('Content-Type', 'application/json')
    }
    const response = await fetch(this.urlBase + path, {method, headers, body})
    const returnValue = await response.json()
    if (callback !== undefined) {
      callback(returnValue)
    }
    return returnValue
  }
}
