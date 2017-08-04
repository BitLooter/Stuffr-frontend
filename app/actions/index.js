/* actions.js -- Contains actions used by the code.

Async task actions should follow this pattern:
  TASK__(START|FINISH|ERROR)
START actions are dispatched when the task begins, FINISH when successfully
completed, and ERROR if any sort of error occured.
*******************************************************************/

import {createAction} from 'redux-actions'
import HttpStatus from 'http-status'
import log from 'loglevel'

import * as api from './api'
import stuffrApi from '../stuffrapi'

export {api}

/* Generic thunk creator for tasks that take a significant amount of time to
complete, e.g. those that make network requests. *Action parameters should
be the appropriate action creators, and apiFunction is an async function
that makes the request. apiFunction is called with the parameters given
to the thunk and doneAction is dispatched with the apiFunction's return
value. */
export function createTaskThunk (apiFunction, requestAction, doneAction, errorAction) {
  return function (...apiParams) {
    return async function (dispatch, getState) {
      dispatch(requestAction())
      try {
        const response = await apiFunction({dispatch, getState}, ...apiParams)
        dispatch(doneAction(response))
        return response
      } catch (error) {
        dispatch(errorAction(error))
        if (error.status === HttpStatus.UNAUTHORIZED) {
          dispatch(authorizationRequired())
        }
      }
    }
  }
}

// Places the API token where it can be retrieved for later sessions
function storeToken (token) {
  window.localStorage.apiToken = token
}

/* Event actions
*******************/
export const AUTHORIZATION_REQUIRED = 'AUTHORIZATION_REQUIRED'
export const authorizationRequired = createAction(AUTHORIZATION_REQUIRED)

export const OPEN_THING_EDITOR = 'OPEN_THING_EDITOR'
export const openThingEditor = createAction(OPEN_THING_EDITOR)
export const CLOSE_THING_EDITOR = 'CLOSE_THING_EDITOR'
export const closeThingEditor = createAction(CLOSE_THING_EDITOR)
export const OPEN_INVENTORY_EDITOR = 'OPEN_INVENTORY_EDITOR'
export const openInventoryEditor = createAction(OPEN_INVENTORY_EDITOR)
export const CLOSE_INVENTORY_EDITOR = 'CLOSE_INVENTORY_EDITOR'
export const closeInventoryEditor = createAction(CLOSE_INVENTORY_EDITOR)

/* Task actions
*******************/

// Actions to log a user into the server
export const LOGIN_USER__START = 'LOGIN_USER__START'
export const loginUserStart = createAction(LOGIN_USER__START)
export const LOGIN_USER__FINISH = 'LOGIN_USER__FINISH'
export const loginUserFinish = createAction(LOGIN_USER__FINISH)
export const LOGIN_USER__ERROR = 'LOGIN_USER__ERROR'
export const loginUserError = createAction(LOGIN_USER__ERROR)
// loginUser - Perform user login and initial client setup.
// Parameters:
//  email: Login ID
//  password: Make a wild guess
// Returns:
//  User info object
export const loginUser = createTaskThunk(
  async function ({dispatch, getState}, email, password) {
    log.info(`loginUser: Logging in user ${email}`)
    await stuffrApi.login(email, password)
    storeToken(stuffrApi.token)
    return dispatch(loadUser())
  },
  loginUserStart, loginUserFinish, loginUserError
)

// Actions to register a new user
export const REGISTER_USER__START = 'REGISTER_USER__START'
export const registerUserStart = createAction(REGISTER_USER__START)
export const REGISTER_USER__FINISH = 'REGISTER_USER__FINISH'
export const registerUserFinish = createAction(REGISTER_USER__FINISH)
export const REGISTER_USER__ERROR = 'REGISTER_USER__ERROR'
export const registerUserError = createAction(REGISTER_USER__ERROR)
// registerUser - Perform user registration
// Parameters:
//  email: Login ID
//  password: Make a wild guess
export const registerUser = createTaskThunk(
  async function ({dispatch, getState}, newUserData) {
    log.info('registerUser: Registering new user')
    await stuffrApi.registerUser(newUserData)
    storeToken(stuffrApi.token)
    dispatch(loadUser())
  },
  registerUserStart, registerUserFinish, registerUserError
)

// Actions to log a user out and remove all their data from the client
export const PURGE_USER = 'PURGE_USER'
export const purgeUser = createAction(PURGE_USER)
// logoutUser - Log the user out and clean up
export const logoutUser = function () {
  return function (dispatch) {
    log.info('purgeUser: Purging user data')
    stuffrApi.logout()
    delete window.localStorage.apiToken
    delete window.localStorage.lastInventoryId
    // Reducers use purgeUser to clean user data from state
    dispatch(purgeUser())
  }
}

// Actions to load a user and their data after login
export const LOAD_USER__START = 'LOAD_USER__START'
export const loadUserStart = createAction(LOAD_USER__START)
export const LOAD_USER__FINISH = 'LOAD_USER__FINISH'
export const loadUserFinish = createAction(LOAD_USER__FINISH)
export const LOAD_USER__ERROR = 'LOAD_USER__ERROR'
export const loadUserError = createAction(LOAD_USER__ERROR)
// loadUser - Perform initial client setup.
// Returns:
//  User info object
export const loadUser = createTaskThunk(
  async function ({dispatch, getState}) {
    log.info('loadUser: Loading user data')
    const userInfo = await stuffrApi.getUserInfo()
    await dispatch(api.getInventories())
    // Inventory list is populated by previous action
    dispatch(loadInventory())
    return userInfo
  },
  loadUserStart, loadUserFinish, loadUserError
)

// Load an inventory and its things
export const LOAD_INVENTORY__START = 'LOAD_INVENTORY__START'
export const loadInventoryStart = createAction(LOAD_INVENTORY__START)
export const LOAD_INVENTORY__FINISH = 'LOAD_INVENTORY__FINISH'
export const loadInventoryFinish = createAction(LOAD_INVENTORY__FINISH)
export const LOAD_INVENTORY__ERROR = 'LOAD_INVENTORY__ERROR'
export const loadInventoryError = createAction(LOAD_INVENTORY__ERROR)
// Parameters:
//  requestedId: ID of the inventory to load. If undefined automatically choose a default.
export const loadInventory = createTaskThunk(
  async function ({dispatch, getState}, requestedId) {
    log.info(`loadInventory: Loading inventory #${requestedId}`)
    let inventoryId, inventoryIndex
    // If no ID check localStorage for the last used ID, uses first inventory if not found
    if (requestedId === undefined) {
      // TODO: Browser/view specific code that should be moved out of the thunk
      log.debug(`loadInventory: No requestedId, using lastInventoryId #${window.localStorage.lastInventoryId}`)
      const lastId = parseInt(window.localStorage.lastInventoryId)
      inventoryIndex = getState().database.inventories.findIndex((v) => v.id === lastId)
      if (inventoryIndex === -1) {
        log.debug(`loadInventory: lastInventoryId #${window.localStorage.lastInventoryId} invalid, loading first inventory`)
        inventoryIndex = 0
      }
      inventoryId = getState().database.inventories[inventoryIndex].id
    } else {
      log.debug('loadInventory: Loading specified inventory')
      inventoryId = requestedId
      inventoryIndex = getState().database.inventories.findIndex((v) => v.id === requestedId)
      if (inventoryIndex === -1) {
        // If a specific inventory is requested but not found something is broken
        const error = `loadInventory: Could not load #${inventoryId}`
        log.error(error)
        throw (Error(error))
      }
    }
    window.localStorage.lastInventoryId = inventoryId
    dispatch(api.getThings(inventoryId))
    return {id: inventoryId, index: inventoryIndex}
  },
  loadInventoryStart, loadInventoryFinish, loadInventoryError
)

export const SUBMIT_THING__START = 'SUBMIT_THING__START'
export const submitThingStart = createAction(SUBMIT_THING__START)
export const SUBMIT_THING__FINISH = 'SUBMIT_THING__FINISH'
export const submitThingFinish = createAction(SUBMIT_THING__FINISH)
export const SUBMIT_THING__ERROR = 'SUBMIT_THING__ERROR'
export const submitThingError = createAction(SUBMIT_THING__ERROR)
export const submitThing = createTaskThunk(
  async function ({dispatch}, thingData, inventoryId, thingId) {
    log.info('submitThing: Submitting thing data')
    let thingResponse
    if (thingId) {
      log.debug(`submitThing: Updating existing thing #${thingId}`)
      thingResponse = await dispatch(api.putThing(thingId, thingData))
    } else {
      log.debug(`submitThing: Adding new thing to inventory #${inventoryId}`)
      thingResponse = await dispatch(api.postThing(thingData, inventoryId))
    }
    return thingResponse
  },
  submitThingStart, submitThingFinish, submitThingError
)

export const REMOVE_THING__START = 'REMOVE_THING__START'
export const removeThingStart = createAction(REMOVE_THING__START)
export const REMOVE_THING__FINISH = 'REMOVE_THING__FINISH'
export const removeThingFinish = createAction(REMOVE_THING__FINISH)
export const REMOVE_THING__ERROR = 'REMOVE_THING__ERROR'
export const removeThingError = createAction(REMOVE_THING__ERROR)
export const removeThing = createTaskThunk(
  async function ({dispatch}, thingId) {
    log.info(`removeThing: Removing thing #${thingId}`)
    await dispatch(api.deleteThing(thingId))
  },
  removeThingStart, removeThingFinish, removeThingError
)

export const SUBMIT_INVENTORY__START = 'SUBMIT_INVENTORY__START'
export const submitInventoryStart = createAction(SUBMIT_INVENTORY__START)
export const SUBMIT_INVENTORY__FINISH = 'SUBMIT_INVENTORY__FINISH'
export const submitInventoryFinish = createAction(SUBMIT_INVENTORY__FINISH)
export const SUBMIT_INVENTORY__ERROR = 'SUBMIT_INVENTORY__ERROR'
export const submitInventoryError = createAction(SUBMIT_INVENTORY__ERROR)
export const submitInventory = createTaskThunk(
  async function ({dispatch}, inventoryData, inventoryId) {
    log.info('submitInventory: Submitting inventory data')
    let response
    if (inventoryId) {
      // TODO: implement updating inventories
      // log.debug('submitInventory: Updating existing inventory')
      // response = await dispatch(api.putInventory(inventoryData, inventoryId))
    } else {
      log.debug('submitInventory: Adding new inventory')
      response = await dispatch(api.postInventory(inventoryData))
      dispatch(loadInventory(response.id))
    }
    return response
  },
  submitInventoryStart, submitInventoryFinish, submitInventoryError
)
