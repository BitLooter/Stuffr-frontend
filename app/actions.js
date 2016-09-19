/* actions.js -- Contains actions used by the code.

Async request actions should follow this pattern:
  VERB_NOUN__(REQUEST|DONE|ERROR)
REQUEST actions are dispatched when the request is made, DONE when successfully
retrieved, and ERROR if any sort of error occured.
/*******************************************************************/

import { createAction } from 'redux-actions'

import stuffrApi from './stuffrapi'

// Generic thunk creator for backend API requests. *Action parameters should
// be the appropriate action creators, and apiFunction is an async function
// that makes the request. apiFunction is called with the parameters given
// to the htunk and doneAction is dispatched with the apiFunction's return
// value.
function createApiThunk (apiFunction, requestAction, doneAction, errorAction, metaCreator) {
  return function (...apiParams) {
    return async function (dispatch) {
      dispatch(requestAction())
      try {
        const response = await apiFunction(...apiParams)
        dispatch(doneAction(response))
      } catch (error) {
        dispatch(errorAction(error))
      }
    }
  }
}

/* UI actions
*******************/

export const CREATE_NEW_THING = 'CREATE_NEW_THING'
export const createNewThing = createAction(CREATE_NEW_THING)
export const EDIT_THING = 'EDIT_THING'
export const editThing = createAction(EDIT_THING)
export const EDIT_THING_DONE = 'EDIT_THING_DONE'
export const editThingDone = createAction(EDIT_THING_DONE)

/* Server API actions
*******************/

// Actions to GET things from the server.
export const GET_THING_LIST__REQUEST = 'GET_THING_LIST__REQUEST'
export const GET_THING_LIST__DONE = 'GET_THING_LIST__DONE'
export const GET_THING_LIST__ERROR = 'GET_THING_LIST__ERROR'
export const getThingListRequest = createAction(GET_THING_LIST__REQUEST)
export const getThingListDone = createAction(GET_THING_LIST__DONE)
export const getThingListError = createAction(GET_THING_LIST__ERROR)
// getThingList - Takes no parameters and returns the list of things
export const getThingList = createApiThunk(
  async () => { return stuffrApi.getThings() },
  getThingListRequest, getThingListDone, getThingListError
)

// Actions to POST a new thing to the server.
export const POST_THING__REQUEST = 'POST_THING__REQUEST'
export const POST_THING__DONE = 'POST_THING__DONE'
export const POST_THING__ERROR = 'POST_THING__ERROR'
export const postThingRequest = createAction(POST_THING__REQUEST)
export const postThingDone = createAction(POST_THING__DONE)
export const postThingError = createAction(POST_THING__ERROR)
// postThing
//  Parameters:
//   thing: New thing object to post to the server.
//  Returns:
//   Original thing merged with new server-souced data such as ID and creation date.
export const postThing = createApiThunk(
  async function (thing) {
    const thingResponse = await stuffrApi.addThing(thing)
    return {...thing, ...thingResponse}
  },
  postThingRequest, postThingDone, postThingError
)

// Actions to update an existing thing on the server.
export const UPDATE_THING__REQUEST = 'UPDATE_THING__REQUEST'
export const UPDATE_THING__DONE = 'UPDATE_THING__DONE'
export const UPDATE_THING__ERROR = 'UPDATE_THING__ERROR'
export const updateThingRequest = createAction(UPDATE_THING__REQUEST)
export const updateThingDone = createAction(UPDATE_THING__DONE)
export const updateThingError = createAction(UPDATE_THING__ERROR)
// updateThing
//  Parameters:
//   thingId: ID of the thing to update
//   thingData: Object containing the values to update
//  Returns:
//   Object containing the id of the modified thing and an object with the
//   modified data.
export const updateThing = createApiThunk(
  async function (thingId, thingData) {
    await stuffrApi.updateThing(thingId, thingData)
    return {id: thingId, update: thingData}
  },
  updateThingRequest, updateThingDone, updateThingError
)

// Actions to remove a thing on the server.
export const DELETE_THING__REQUEST = 'DELETE_THING__REQUEST'
export const DELETE_THING__DONE = 'DELETE_THING__DONE'
export const DELETE_THING__ERROR = 'DELETE_THING__ERROR'
export const deleteThingRequest = createAction(DELETE_THING__REQUEST)
export const deleteThingDone = createAction(DELETE_THING__DONE)
export const deleteThingError = createAction(DELETE_THING__ERROR)
// deleteThing
//  Parameters:
//   thingId: ID of the thing to delete
//  Returns:
//   ID of the thing deleted
export const deleteThing = createApiThunk(
  async function (thingId) {
    await stuffrApi.deleteThing(thingId)
    return thingId
  },
  deleteThingRequest, deleteThingDone, deleteThingError
)
