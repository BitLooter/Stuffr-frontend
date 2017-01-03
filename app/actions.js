/* actions.js -- Contains actions used by the code.

Async request actions should follow this pattern:
  VERB_NOUN__(REQUEST|DONE|ERROR)
REQUEST actions are dispatched when the request is made, DONE when successfully
retrieved, and ERROR if any sort of error occured.
/*******************************************************************/

import { createAction } from 'redux-actions'
import HttpStatus from 'http-status'

import stuffrApi from './stuffrapi'

// Generic thunk creator for backend API requests. *Action parameters should
// be the appropriate action creators, and apiFunction is an async function
// that makes the request. apiFunction is called with the parameters given
// to the thunk and doneAction is dispatched with the apiFunction's return
// value.
function createApiThunk (apiFunction, requestAction, doneAction, errorAction) {
  return function (...apiParams) {
    return async function (dispatch, getState) {
      dispatch(requestAction())
      try {
        const response = await apiFunction(...apiParams, {dispatch, getState})
        dispatch(doneAction(response))
      } catch (error) {
        dispatch(errorAction(error))
        if (error.status === HttpStatus.UNAUTHORIZED) {
          dispatch(authorizationRequired())
        }
      }
    }
  }
}

/* Task actions
*******************/

// Actions to log a user into the server
export const LOGIN_USER__REQUEST = 'LOGIN_USER__REQUEST'
export const LOGIN_USER__DONE = 'LOGIN_USER__DONE'
export const LOGIN_USER__ERROR = 'LOGIN_USER__ERROR'
export const loginUserRequest = createAction(LOGIN_USER__REQUEST)
export const loginUserDone = createAction(LOGIN_USER__DONE)
export const loginUserError = createAction(LOGIN_USER__ERROR)
// loginUser - Perform user login and initial client setup.
// Parameters:
//  email: Login ID
//  password: Make a wild guess
// Returns:
//  User info object
export const loginUser = createApiThunk(
  async function (email, password, {dispatch, getState}) {
    await stuffrApi.login(email, password)
    window.localStorage.apiToken = stuffrApi.token
    return await dispatch(loadUser())
  },
  loginUserRequest, loginUserDone, loginUserError
)

// Actions to load a user and their data after login
export const LOAD_USER__REQUEST = 'LOAD_USER__REQUEST'
export const LOAD_USER__DONE = 'LOAD_USER__DONE'
export const LOAD_USER__ERROR = 'LOAD_USER__ERROR'
export const loadUserRequest = createAction(LOAD_USER__REQUEST)
export const loadUserDone = createAction(LOAD_USER__DONE)
export const loadUserError = createAction(LOAD_USER__ERROR)
// loadUser - Perform initial client setup.
// Returns:
//  User info object
export const loadUser = createApiThunk(
  async function ({dispatch, getState}) {
    const userInfo = await stuffrApi.getUserInfo()
    await dispatch(getInventoryList())
    // Inventory list is populated by previous action
    // TODO: remember last used inventory
    dispatch(loadInventory(0))
    return userInfo
  },
  loadUserRequest, loadUserDone, loadUserError
)

// Load an inventory and its things
export const LOAD_INVENTORY__REQUEST = 'LOAD_INVENTORY__REQUEST'
export const LOAD_INVENTORY__DONE = 'LOAD_INVENTORY__DONE'
export const LOAD_INVENTORY__ERROR = 'LOAD_INVENTORY__ERROR'
export const loadInventoryRequest = createAction(LOAD_INVENTORY__REQUEST)
export const loadInventoryDone = createAction(LOAD_INVENTORY__DONE)
export const loadInventoryError = createAction(LOAD_INVENTORY__ERROR)
// Parameters:
//  inventoryIndex: Index of the inventory in state.database.inventories
export const loadInventory = createApiThunk(
  async function (inventoryIndex, {dispatch, getState}) {
    const inventoryId = getState().database.inventories[inventoryIndex].id
    dispatch(setCurrentInventory(inventoryIndex))
    dispatch(getThingList(inventoryId))
  },
  loadInventoryRequest, loadInventoryDone, loadInventoryError
)

/* UI actions
*******************/

export const CREATE_NEW_THING = 'CREATE_NEW_THING'
export const createNewThing = createAction(CREATE_NEW_THING)
export const EDIT_THING = 'EDIT_THING'
export const editThing = createAction(EDIT_THING)
export const EDIT_THING_DONE = 'EDIT_THING_DONE'
export const editThingDone = createAction(EDIT_THING_DONE)
export const CREATE_NEW_INVENTORY = 'CREATE_NEW_INVENTORY'
export const createNewInventory = createAction(CREATE_NEW_INVENTORY)
export const EDIT_INVENTORY = 'EDIT_INVENTORY'
export const editInventory = createAction(EDIT_INVENTORY)
export const EDIT_INVENTORY_DONE = 'EDIT_INVENTORY_DONE'
export const editInventoryDone = createAction(EDIT_INVENTORY_DONE)
export const SET_CURRENT_INVENTORY = 'SET_CURRENT_INVENTORY'
export const setCurrentInventory = createAction(SET_CURRENT_INVENTORY)
export const AUTHORIZATION_REQUIRED = 'AUTHORIZATION_REQUIRED'
export const authorizationRequired = createAction(AUTHORIZATION_REQUIRED)

/* Server API actions
*******************/

// Actions get the current user's info from the server
export const GET_USER_INFO__REQUEST = 'GET_USER_INFO__REQUEST'
export const GET_USER_INFO__DONE = 'GET_USER_INFO__DONE'
export const GET_USER_INFO__ERROR = 'GET_USER_INFO__ERROR'
export const getUserInfoRequest = createAction(GET_USER_INFO__REQUEST)
export const getUserInfoDone = createAction(GET_USER_INFO__DONE)
export const getUserInfoError = createAction(GET_USER_INFO__ERROR)
// getUserInfo - Takes no parameters and returns user information
export const getUserInfo = createApiThunk(
  async function () {
    return stuffrApi.getUserInfo()
  },
  getUserInfoRequest, getUserInfoDone, getUserInfoError
)

// Actions to GET inventories from the server.
export const GET_INVENTORY_LIST__REQUEST = 'GET_INVENTORY_LIST__REQUEST'
export const GET_INVENTORY_LIST__DONE = 'GET_INVENTORY_LIST__DONE'
export const GET_INVENTORY_LIST__ERROR = 'GET_INVENTORY_LIST__ERROR'
export const getInventoryListRequest = createAction(GET_INVENTORY_LIST__REQUEST)
export const getInventoryListDone = createAction(GET_INVENTORY_LIST__DONE)
export const getInventoryListError = createAction(GET_INVENTORY_LIST__ERROR)
// getInventoryList - Takes no parameters and returns a list of inventories
export const getInventoryList = createApiThunk(
  async function () {
    return stuffrApi.getInventories()
  },
  getInventoryListRequest, getInventoryListDone, getInventoryListError
)

// Actions to POST a new inventory to the server.
export const POST_INVENTORY__REQUEST = 'POST_INVENTORY__REQUEST'
export const POST_INVENTORY__DONE = 'POST_INVENTORY__DONE'
export const POST_INVENTORY__ERROR = 'POST_INVENTORY__ERROR'
export const postInventoryRequest = createAction(POST_INVENTORY__REQUEST)
export const postInventoryDone = createAction(POST_INVENTORY__DONE)
export const postInventoryError = createAction(POST_INVENTORY__ERROR)
// postInventory
//  Parameters:
//   thing: New inventory object to post to the server.
//  Returns:
//   Original inventory merged with new server-souced data such as ID and creation date.
export const postInventory = createApiThunk(
  async function (inventory) {
    const inventoryResponse = await stuffrApi.addInventory(inventory)
    return {...inventory, ...inventoryResponse}
  },
  postInventoryRequest, postInventoryDone, postInventoryError
)

// Actions to GET things from the server.
export const GET_THING_LIST__REQUEST = 'GET_THING_LIST__REQUEST'
export const GET_THING_LIST__DONE = 'GET_THING_LIST__DONE'
export const GET_THING_LIST__ERROR = 'GET_THING_LIST__ERROR'
export const getThingListRequest = createAction(GET_THING_LIST__REQUEST)
export const getThingListDone = createAction(GET_THING_LIST__DONE)
export const getThingListError = createAction(GET_THING_LIST__ERROR)
// getThingList - Takes inventory ID and returns the things it contains
export const getThingList = createApiThunk(
  async function (inventoryId) {
    return stuffrApi.getThings(inventoryId)
  },
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
  async function (inventoryId, thing) {
    const thingResponse = await stuffrApi.addThing(inventoryId, thing)
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
