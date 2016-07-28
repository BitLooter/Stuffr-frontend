// actions.js -- Contains actions used by the code.

import { createAction } from 'redux-actions'

// export const REQUEST_THING_LIST = 'REQUEST_THING_LIST'
// export const RECEIVE_THING_LIST = 'RECEIVE_THING_LIST'
// export const RECEIVE_THING_LIST_ERROR = 'RECEIVE_THING_LIST_ERROR'
// export const REQUEST_ADD_THING = 'REQUEST_ADD_THING'
// export const RECEIVE_ADD_THING = 'RECEIVE_ADD_THING'
// export const RECEIVE_ADD_THING_ERROR = 'RECEIVE_ADD_THING_ERROR'
export const SHOW_THING_INFO = 'SHOW_THING_INFO'

export const showThingInfo = createAction(SHOW_THING_INFO)

// Async request actions. They should follow this pattern:
// VERB_NOUN__(REQUEST|DONE|ERROR)
// REQUEST is dispatched when the request is made, DONE when successfully
// retrieved, and ERROR if any sort of error occured.
export const GET_THING_LIST__REQUEST = 'GET_THING_LIST__REQUEST'
export const GET_THING_LIST__DONE = 'GET_THING_LIST__DONE'
export const GET_THING_LIST__ERROR = 'GET_THING_LIST__ERROR'
export const POST_THING__REQUEST = 'POST_THING__REQUEST'
export const POST_THING__DONE = 'POST_THING__DONE'
export const POST_THING__ERROR = 'POST_THING__ERROR'

export const getThingListRequest = createAction(GET_THING_LIST__REQUEST)
export const getThingListDone = createAction(GET_THING_LIST__DONE)
export const getThingListError = createAction(GET_THING_LIST__ERROR)

/* Thunk action to get a list of things from the server. */
export function getThingList () {
  return async function (dispatch) {
    dispatch(getThingListRequest())
    try {
      const thingList = await global.stuffrapi.getThings()
      dispatch(getThingListDone(thingList))
    } catch (error) {
      dispatch(getThingListError(error))
    }
  }
}

export const postThingRequest = createAction(POST_THING__REQUEST)
export const postThingDone = createAction(POST_THING__DONE)
export const postThingError = createAction(POST_THING__ERROR)

export function postThing (thing) {
  return async function (dispatch) {
    dispatch(postThingRequest())
    try {
      const thingResponse = await global.stuffrapi.addThing(thing)
      dispatch(postThingDone({...thing, id: thingResponse.id}))
    } catch (error) {
      dispatch(postThingError(error))
    }
  }
}
