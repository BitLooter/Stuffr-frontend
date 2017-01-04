/* Server API actions
*********************/

import {createAction} from 'redux-actions'

import {createApiThunk} from '.'
import stuffrApi from '../stuffrapi'

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
