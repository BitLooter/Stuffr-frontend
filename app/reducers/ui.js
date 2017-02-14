/* Reducers to manage UI state */

import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

import * as models from '../models'

const DIALOG_CLOSED = Symbol.for('ui.DIALOG_CLOSED')
const THINGDIALOG_NEW = Symbol.for('ui.THINGDIALOG_NEW')
const THINGDIALOG_EDIT = Symbol.for('ui.THINGDIALOG_EDIT')
const INVENTORYDIALOG_NEW = Symbol.for('ui.INVENTORYDIALOG_NEW')
const INVENTORYDIALOG_EDIT = Symbol.for('ui.INVENTORYDIALOG_EDIT')

const placeholderThing = Immutable(models.createThing({name: 'PLACEHOLDER'}))
const placeholderInventory = Immutable(models.createInventory({name: 'PLACEHOLDER'}))
const emptyThing = Immutable(models.createThing())
const emptyInventory = Immutable(models.createInventory())
const noUser = Immutable({authenticated: false, currentInventory: null})

function createNewThingReducer (state, action) {
  let newState = state.setIn(['thingDialog', 'mode'], THINGDIALOG_NEW)
  newState = newState.setIn(['thingDialog', 'thing'], emptyThing)
  return newState
}

function editThingReducer (state, action) {
  let newState = state.setIn(['thingDialog', 'mode'], THINGDIALOG_EDIT)
  newState = newState.setIn(['thingDialog', 'thing'], Immutable(action.payload))
  return newState
}

function editThingDoneReducer (state, action) {
  return state.setIn(['thingDialog', 'mode'], DIALOG_CLOSED)
}

function createNewInventoryReducer (state, action) {
  let newState = state.setIn(['inventoryDialog', 'mode'], INVENTORYDIALOG_NEW)
  newState = newState.setIn(['inventoryDialog', 'inventory'], emptyInventory)
  return newState
}

function editInventoryReducer (state, action) {
  let newState = state.setIn(['inventoryDialog', 'mode'], INVENTORYDIALOG_EDIT)
  newState = newState.setIn(['inventoryDialog', 'inventory'], Immutable(action.payload))
  return newState
}

function editInventoryDoneReducer (state, action) {
  return state.setIn(['inventoryDialog', 'mode'], DIALOG_CLOSED)
}

function setCurrentInventoryReducer (state, action) {
  return state.set('currentInventory', action.payload)
}

function authorizationRequiredReducer (state, action) {
  return state.set('authenticated', false)
}

function userAuthenticatedReducer (state, action) {
  return state.set('authenticated', true)
}

function userLoginErrorReducer (state, action) {
  // TODO: make login/register errors more user-friendly
  return state.set('loginDialogError', action.payload.message)
}

function userRegisterErrorReducer (state, action) {
  return state.set('registerDialogError', action.payload.message)
}

function purgeUserReducer (state, action) {
  return state.merge(noUser)
}

const ui = handleActions({
  CREATE_NEW_THING: createNewThingReducer,
  EDIT_THING: editThingReducer,
  EDIT_THING_DONE: editThingDoneReducer,
  CREATE_NEW_INVENTORY: createNewInventoryReducer,
  EDIT_INVENTORY: editInventoryReducer,
  EDIT_INVENTORY_DONE: editInventoryDoneReducer,
  SET_CURRENT_INVENTORY: setCurrentInventoryReducer,
  AUTHORIZATION_REQUIRED: authorizationRequiredReducer,
  LOGIN_USER__DONE: userAuthenticatedReducer,
  LOGIN_USER__ERROR: userLoginErrorReducer,
  REGISTER_USER__DONE: userAuthenticatedReducer,
  REGISTER_USER__ERROR: userRegisterErrorReducer,
  PURGE_USER: purgeUserReducer
}, Immutable({
  authenticated: true,
  currentInventory: null,
  thingDialog: {
    mode: DIALOG_CLOSED,
    thing: placeholderThing
  },
  inventoryDialog: {
    mode: DIALOG_CLOSED,
    inventory: placeholderInventory
  },
  loginDialogError: undefined,
  registerDialogError: undefined
}, {deep: true}
))

export default ui
