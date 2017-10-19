/* Server API actions

Async request actions should follow this pattern:
  VERB_NOUN__(REQUEST|DONE|ERROR)
REQUEST actions are dispatched when the request is made, DONE when successfully
retrieved, and ERROR if any sort of error occured.
*******************************************************************/

import {createAction} from 'redux-actions'
import log from 'loglevel'

import {createTaskThunk} from '.'
import stuffrApi from '../../stuffrapi'

// Actions get the current user's info from the server
export const GET_USER_INFO__REQUEST = 'GET_USER_INFO__REQUEST'
export const getUserInfoRequest = createAction(GET_USER_INFO__REQUEST)
export const GET_USER_INFO__DONE = 'GET_USER_INFO__DONE'
export const getUserInfoDone = createAction(GET_USER_INFO__DONE)
export const GET_USER_INFO__ERROR = 'GET_USER_INFO__ERROR'
export const getUserInfoError = createAction(GET_USER_INFO__ERROR)
// getUserInfo - Takes no parameters and returns user information
export const getUserInfo = createTaskThunk(
  async function () {
    log.debug('getUserInfo: Retrieving user info')
    return stuffrApi.getUserInfo()
  },
  getUserInfoRequest, getUserInfoDone, getUserInfoError
)

// Actions to GET inventories from the server.
export const GET_INVENTORIES__REQUEST = 'GET_INVENTORIES__REQUEST'
export const getInventoriesRequest = createAction(GET_INVENTORIES__REQUEST)
export const GET_INVENTORIES__DONE = 'GET_INVENTORIES__DONE'
export const getInventoriesDone = createAction(GET_INVENTORIES__DONE)
export const GET_INVENTORIES__ERROR = 'GET_INVENTORIES__ERROR'
export const getInventoriesError = createAction(GET_INVENTORIES__ERROR)
// getInventories - Takes no parameters and returns all inventories
export const getInventories = createTaskThunk(
  async function () {
    log.debug('getInventories: Retrieving inventories')
    return stuffrApi.getInventories()
  },
  getInventoriesRequest, getInventoriesDone, getInventoriesError
)

// Actions to POST a new inventory to the server.
export const POST_INVENTORY__REQUEST = 'POST_INVENTORY__REQUEST'
export const postInventoryRequest = createAction(POST_INVENTORY__REQUEST)
export const POST_INVENTORY__DONE = 'POST_INVENTORY__DONE'
export const postInventoryDone = createAction(POST_INVENTORY__DONE)
export const POST_INVENTORY__ERROR = 'POST_INVENTORY__ERROR'
export const postInventoryError = createAction(POST_INVENTORY__ERROR)
// postInventory
//  Parameters:
//   thing: New inventory object to post to the server.
//  Returns:
//   Original inventory merged with new server-souced data such as ID and creation date.
export const postInventory = createTaskThunk(
  async function (_, inventory) {
    log.debug(`postInventory: POST request for new inventory ${inventory.name}`)
    const inventoryResponse = await stuffrApi.addInventory(inventory)
    return {...inventory, ...inventoryResponse}
  },
  postInventoryRequest, postInventoryDone, postInventoryError
)

// Actions to GET things from the server.
export const GET_THINGS__REQUEST = 'GET_THINGS__REQUEST'
export const getThingsRequest = createAction(GET_THINGS__REQUEST)
export const GET_THINGS__DONE = 'GET_THINGS__DONE'
export const getThingsDone = createAction(GET_THINGS__DONE)
export const GET_THINGS__ERROR = 'GET_THINGS__ERROR'
export const getThingsError = createAction(GET_THINGS__ERROR)
// getThings - Takes inventory ID and returns the things it contains
export const getThings = createTaskThunk(
  async function (_, inventoryId) {
    log.debug(`getThingList: GET for inventory #${inventoryId}`)
    return stuffrApi.getThings(inventoryId)
  },
  getThingsRequest, getThingsDone, getThingsError
)

// Actions to POST a new thing to the server.
export const POST_THING__REQUEST = 'POST_THING__REQUEST'
export const postThingRequest = createAction(POST_THING__REQUEST)
export const POST_THING__DONE = 'POST_THING__DONE'
export const postThingDone = createAction(POST_THING__DONE)
export const POST_THING__ERROR = 'POST_THING__ERROR'
export const postThingError = createAction(POST_THING__ERROR)
// postThing
//  Parameters:
//   thing: New thing object to post to the server.
//  Returns:
//   Original thing merged with new server-souced data such as ID and creation date.
export const postThing = createTaskThunk(
  async function (_, thingData, inventoryId) {
    const thingResponse = await stuffrApi.postThing(thingData, inventoryId)
    return {...thingData, ...thingResponse}
  },
  postThingRequest, postThingDone, postThingError
)

// Actions to update an existing thing on the server.
export const PUT_THING__REQUEST = 'PUT_THING__REQUEST'
export const putThingRequest = createAction(PUT_THING__REQUEST)
export const PUT_THING__DONE = 'PUT_THING__DONE'
export const putThingDone = createAction(PUT_THING__DONE)
export const PUT_THING__ERROR = 'PUT_THING__ERROR'
export const putThingError = createAction(PUT_THING__ERROR)
// putThing
//  Parameters:
//   thingId: ID of the thing to update
//   thingData: Object containing the values to update
//  Returns:
//   Object containing the id of the modified thing and an object with the
//   modified data.
export const putThing = createTaskThunk(
  async function (_, thingId, thingData) {
    await stuffrApi.putThing(thingId, thingData)
    return {id: thingId, update: thingData}
  },
  putThingRequest, putThingDone, putThingError
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
export const deleteThing = createTaskThunk(
  async function (_, thingId) {
    await stuffrApi.deleteThing(thingId)
    return thingId
  },
  deleteThingRequest, deleteThingDone, deleteThingError
)
