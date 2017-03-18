/* actions.js -- Contains actions used by the code.

Async request actions should follow this pattern:
  VERB_NOUN__(REQUEST|DONE|ERROR)
REQUEST actions are dispatched when the request is made, DONE when successfully
retrieved, and ERROR if any sort of error occured.
/*******************************************************************/

import {createAction} from 'redux-actions'
import HttpStatus from 'http-status'

import * as ui from './ui'
import * as api from './api'
import stuffrApi from '../stuffrapi'

export {ui, api}

// Generic thunk creator for backend API requests. *Action parameters should
// be the appropriate action creators, and apiFunction is an async function
// that makes the request. apiFunction is called with the parameters given
// to the thunk and doneAction is dispatched with the apiFunction's return
// value.
export function createApiThunk (apiFunction, requestAction, doneAction, errorAction) {
  return function (...apiParams) {
    return async function (dispatch, getState) {
      dispatch(requestAction())
      try {
        const response = await apiFunction(...apiParams, {dispatch, getState})
        dispatch(doneAction(response))
        return response
      } catch (error) {
        dispatch(errorAction(error))
        if (error.status === HttpStatus.UNAUTHORIZED) {
          dispatch(ui.authorizationRequired())
        }
      }
    }
  }
}

// Places the API token where it can be retrieved for later sessions
function storeToken (token) {
  window.localStorage.apiToken = token
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
    storeToken(stuffrApi.token)
    return await dispatch(loadUser())
  },
  loginUserRequest, loginUserDone, loginUserError
)

// Actions to register a new user
export const REGISTER_USER__REQUEST = 'REGISTER_USER__REQUEST'
export const REGISTER_USER__DONE = 'REGISTER_USER__DONE'
export const REGISTER_USER__ERROR = 'REGISTER_USER__ERROR'
export const registerUserRequest = createAction(REGISTER_USER__REQUEST)
export const registerUserDone = createAction(REGISTER_USER__DONE)
export const registerUserError = createAction(REGISTER_USER__ERROR)
// registerUser - Perform user registration
// Parameters:
//  email: Login ID
//  password: Make a wild guess
// Returns:
//  User info object
export const registerUser = createApiThunk(
  async function (newUserData, {dispatch, getState}) {
    await stuffrApi.registerUser(newUserData)
    storeToken(stuffrApi.token)
    dispatch(loadUser())
  },
  registerUserRequest, registerUserDone, registerUserError
)

// Actions to log a user out and remove all their data from the client
export const PURGE_USER = 'PURGE_USER'
export const purgeUser = createAction(PURGE_USER)
// logoutUser - Log the user out and clean up
export const logoutUser = function () {
  return function (dispatch) {
    stuffrApi.logout()
    delete window.localStorage.apiToken
    delete window.localStorage.lastInventoryId
    // Reducers use purgeUser to clean user data from state
    dispatch(purgeUser())
  }
}

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
    await dispatch(api.getInventoryList())
    // Inventory list is populated by previous action
    const lastInventoryId = parseInt(window.localStorage.lastInventoryId)
    dispatch(loadInventory(lastInventoryId))
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
  async function (inventoryId, {dispatch, getState}) {
    const inventoryIndex = getState().database.inventories.findIndex((v) => v.id === inventoryId)
    window.localStorage.lastInventoryId = inventoryId
    dispatch(api.getThingList(inventoryId))
    return {id: inventoryId, index: inventoryIndex}
  },
  loadInventoryRequest, loadInventoryDone, loadInventoryError
)

export const CREATE_INVENTORY__START = 'CREATE_INVENTORY__START'
export const createInventoryStart = createAction(CREATE_INVENTORY__START)
export const CREATE_INVENTORY__FINISH = 'CREATE_INVENTORY__FINISH'
export const createInventoryFinish = createAction(CREATE_INVENTORY__FINISH)
export const CREATE_INVENTORY__CANCEL = 'CREATE_INVENTORY__CANCEL'
export const createInventoryCancel = createAction(CREATE_INVENTORY__CANCEL)
export function createInventory (inventoryData) {
  return async function createInventoryThunk (dispatch) {
    const newInventory = await dispatch(api.postInventory(inventoryData))
    dispatch(createInventoryFinish(newInventory))
    dispatch(loadInventory(newInventory.id))
    return newInventory
  }
}
