import { createAction } from 'redux-actions'

export const REQUEST_THING_LIST = 'REQUEST_THING_LIST'
export const RECEIVE_THING_LIST = 'RECEIVE_THING_LIST'
export const RECEIVE_THING_LIST_ERROR = 'RECEIVE_THING_LIST_ERROR'
export const FETCH_THING_LIST = 'FETCH_THING_LIST'
export const REQUEST_ADD_THING = 'REQUEST_ADD_THING'
export const RECEIVE_ADD_THING = 'RECEIVE_ADD_THING'
export const RECEIVE_ADD_THING_ERROR = 'RECEIVE_ADD_THING_ERROR'
export const ADD_THING = 'ADD_THING'
export const SHOW_THING_INFO = 'SHOW_THING_INFO'

export const requestThingList = createAction(REQUEST_THING_LIST)
export const receiveThingList = createAction(RECEIVE_THING_LIST)
export const receiveThingListError = createAction(RECEIVE_THING_LIST_ERROR)

/* Thunk action to get a list of things from the server. Dispatches
   requestThingList when called and receiveThingList when the data is ready. */
export function fetchThingList () {
  return async function (dispatch) {
    dispatch(requestThingList())
    try {
      const thingList = await global.stuffrapi.getThings()
      dispatch(receiveThingList(thingList))
    } catch (error) {
      dispatch(receiveThingListError(error))
    }
  }
}

export const requestAddThing = createAction(REQUEST_ADD_THING)
export const receiveAddThing = createAction(RECEIVE_ADD_THING)
export const receiveAddThingError = createAction(RECEIVE_ADD_THING_ERROR)

export function addThing (thing) {
  return async function (dispatch) {
    dispatch(requestAddThing())
    try {
      const thingResponse = await global.stuffrapi.addThing(thing)
      dispatch(receiveAddThing(thingResponse))
    } catch (error) {
      dispatch(receiveAddThingError(error))
    }
  }
}

export const showThingInfo = createAction(SHOW_THING_INFO)
