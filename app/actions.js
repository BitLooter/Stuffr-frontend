import { createAction } from 'redux-actions'

export const REQUEST_THING_LIST = 'REQUEST_THING_LIST'
export const RECEIVE_THING_LIST = 'RECEIVE_THING_LIST'
export const FETCH_THING_LIST = 'FETCH_THING_LIST'
export const REQUEST_ADD_THING = 'REQUEST_ADD_THING'
export const RECEIVE_ADD_THING = 'RECEIVE_ADD_THING'
export const ADD_THING = 'ADD_THING'
export const SHOW_THING_INFO = 'SHOW_THING_INFO'

let nextThingID = 0

export const requestThingList = createAction(REQUEST_THING_LIST)
export const receiveThingList = createAction(RECEIVE_THING_LIST)

/* Thunk action to get a list of things from the server. Dispatches
   requestThingList when called and receiveThingList when the data is ready. */
export function fetchThingList () {
  return function (dispatch) {
    dispatch(requestThingList())
    // TODO: split off API code into different module/package
    const _ = (async () => {
      try {
        let response = await fetch('http://drwily:8080/api/things')
        let thingList = await response.json()
        dispatch(receiveThingList(thingList))
      } catch(error) {
        // TODO: better error handling
        console.error(error)
        throw error
      }
    })()
  }
}

export const requestAddThing = createAction(REQUEST_ADD_THING)
export const receiveAddThing = createAction(RECEIVE_ADD_THING)

export function addThing (name) {
  return function (dispatch) {
    dispatch(requestAddThing())
    const _ = (async () => {
      try {
        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        let response = await fetch('http://drwily:8080/api/things', {
                                      method: 'post',
                                      headers,
                                      body: JSON.stringify({name})
        })
        let addResult = await response.json()
        dispatch(receiveAddThing(addResult))
      } catch (e) {
        console.error(error)
        throw error
      }
    })()
  }
}

export const showThingInfo = createAction(SHOW_THING_INFO)
