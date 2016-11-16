/* Reducers to manage UI state */

import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

import * as models from '../models'

const THINGDIALOG_NEW = Symbol.for('ui.THINGDIALOG_NEW')
const THINGDIALOG_EDIT = Symbol.for('ui.THINGDIALOG_EDIT')
const THINGDIALOG_CLOSED = Symbol.for('ui.THINGDIALOG_CLOSED')

const placeholderThing = Immutable(models.createThing('PLACEHOLDER'))
const emptyThing = Immutable(models.createThing(''))

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
  return state.setIn(['thingDialog', 'mode'], THINGDIALOG_CLOSED)
}

function authorizationRequiredReducer (state, action) {
  return state.set('authorized', false)
}

const things = handleActions({
  CREATE_NEW_THING: createNewThingReducer,
  EDIT_THING: editThingReducer,
  EDIT_THING_DONE: editThingDoneReducer,
  AUTHORIZATION_REQUIRED: authorizationRequiredReducer
}, Immutable({
  authorized: true,
  thingDialog: {
    mode: THINGDIALOG_CLOSED,
    thing: placeholderThing
  }}, {deep: true}
))

export default things
