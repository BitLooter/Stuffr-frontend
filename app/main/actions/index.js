/* actions.js -- Contains actions used by the code.

Async task actions should follow this pattern:
  TASK__(START|FINISH|ERROR)
START actions are dispatched when the task begins, FINISH when successfully
completed, and ERROR if any sort of error occured.
*******************************************************************/

import { createAction } from 'redux-actions'
import log from 'loglevel'

import { createTaskThunk } from '../../common/actions'
import * as api from './api'
import stuffrApi from '../../stuffrapi'

export { api }

/* Event actions
*****************/
export const OPEN_THING_EDITOR = 'OPEN_THING_EDITOR'
export const openThingEditor = createAction(OPEN_THING_EDITOR)
export const CLOSE_THING_EDITOR = 'CLOSE_THING_EDITOR'
export const closeThingEditor = createAction(CLOSE_THING_EDITOR)
export const OPEN_INVENTORY_EDITOR = 'OPEN_INVENTORY_EDITOR'
export const openInventoryEditor = createAction(OPEN_INVENTORY_EDITOR)
export const CLOSE_INVENTORY_EDITOR = 'CLOSE_INVENTORY_EDITOR'
export const closeInventoryEditor = createAction(CLOSE_INVENTORY_EDITOR)

/* Task actions
****************/

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
    // TODO: Last inventory is not being saved
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
    // TODO: abstract window/localStorage out
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
