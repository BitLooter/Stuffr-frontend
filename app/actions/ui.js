/* Actions relating to the user interface.
******************************************/

import {createAction} from 'redux-actions'

export const CREATE_NEW_THING = 'CREATE_NEW_THING'
export const createNewThing = createAction(CREATE_NEW_THING)
export const EDIT_THING = 'EDIT_THING'
export const editThing = createAction(EDIT_THING)
export const EDIT_THING_DONE = 'EDIT_THING_DONE'
export const editThingDone = createAction(EDIT_THING_DONE)
export const AUTHORIZATION_REQUIRED = 'AUTHORIZATION_REQUIRED'
export const authorizationRequired = createAction(AUTHORIZATION_REQUIRED)
