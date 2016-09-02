import { handleActions } from 'redux-actions'
import * as immutable from 'immutable'

import * as models from '../models'

const THINGDIALOG_EDIT = Symbol.for('ui.THINGDIALOG_EDIT')
const THINGDIALOG_CLOSED = Symbol.for('ui.THINGDIALOG_CLOSED')

const placeholderThing = models.createThing('PLACEHOLDER')

function editThingReducer (state, action) {
  let newState = state.setIn(['thingDialog', 'mode'], THINGDIALOG_EDIT)
  newState = newState.setIn(['thingDialog', 'thing'], immutable.fromJS(action.payload))
  return newState
}

function editThingDoneReducer (state, action) {
  return state.setIn(['thingDialog', 'mode'], THINGDIALOG_CLOSED)
}

const things = handleActions({
  EDIT_THING: editThingReducer,
  EDIT_THING_DONE: editThingDoneReducer
}, immutable.fromJS({
  thingDialog: {
    mode: THINGDIALOG_CLOSED,
    thing: placeholderThing
  }
}))

export default things
