// actions.js -- Contains actions used by the code.
//
// Async request actions should follow this pattern:
// VERB_NOUN__(REQUEST|DONE|ERROR)
// REQUEST is dispatched when the request is made, DONE when successfully
// retrieved, and ERROR if any sort of error occured.

import { createAction } from 'redux-actions'

// Generic thunk creator for backend API requests. *Action parameters should
// be the appropriate action creators, and apiFunction is an async function
// that makes the request.
function createApiThunk (apiFunction, requestAction, doneAction, errorAction) {
  return function (apiParams) {
    return async function (dispatch) {
      dispatch(requestAction())
      try {
        const response = await apiFunction(apiParams)
        dispatch(doneAction(response))
      } catch (error) {
        dispatch(errorAction(error))
      }
    }
  }
}

export const SHOW_THING_INFO = 'SHOW_THING_INFO'

export const showThingInfo = createAction(SHOW_THING_INFO)

// Actions to GET things from the server.
export const GET_THING_LIST__REQUEST = 'GET_THING_LIST__REQUEST'
export const GET_THING_LIST__DONE = 'GET_THING_LIST__DONE'
export const GET_THING_LIST__ERROR = 'GET_THING_LIST__ERROR'
export const getThingListRequest = createAction(GET_THING_LIST__REQUEST)
export const getThingListDone = createAction(GET_THING_LIST__DONE)
export const getThingListError = createAction(GET_THING_LIST__ERROR)
export const getThingList = createApiThunk(
  async () => { return global.stuffrapi.getThings() },
  getThingListRequest, getThingListDone, getThingListError
)

// Actions to POST a new thing to the server.
export const POST_THING__REQUEST = 'POST_THING__REQUEST'
export const POST_THING__DONE = 'POST_THING__DONE'
export const POST_THING__ERROR = 'POST_THING__ERROR'
export const postThingRequest = createAction(POST_THING__REQUEST)
export const postThingDone = createAction(POST_THING__DONE)
export const postThingError = createAction(POST_THING__ERROR)
export const postThing = createApiThunk(
  async function (thing) {
    const thingResponse = await global.stuffrapi.addThing(thing)
    return {...thing, id: thingResponse.id}
  },
  postThingRequest, postThingDone, postThingError
)
