import { handleActions } from 'redux-actions'
import * as immutable from 'immutable'

function genericErrorReducer (state, action) {
  // TODO: log this error instead of printing to console
  console.error(action.payload)
  return state
}

function requestThingListReducer (state, action) {
  return state
}

function receiveThingListReducer (state, action) {
  return immutable.List(action.payload)
}

function receiveAddThingReducer (state, action) {
  return state.push({id: action.payload.id, name: action.payload.name})
}

function showThingReducer (state, action) {
  window.alert(state.get(action.payload).name)
  return state
}

const things = handleActions({
  REQUEST_THING_LIST: requestThingListReducer,
  RECEIVE_THING_LIST: receiveThingListReducer,
  RECEIVE_THING_LIST_ERROR: genericErrorReducer,
  RECEIVE_ADD_THING: receiveAddThingReducer,
  SHOW_THING_INFO: showThingReducer
}, immutable.List())

export default things
