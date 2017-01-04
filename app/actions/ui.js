/* Actions relating to the user interface.
******************************************/

import {createAction} from 'redux-actions'

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
