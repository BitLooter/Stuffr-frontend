import { handleActions } from 'redux-actions'
import * as immutable from 'immutable'

function requestThingListReducer (state, action) {
  return state
}

function receiveThingListReducer (state, action) {
  return immutable.List(action.payload)
}

function addThingReducer (state, action) {
  return state.push({id: action.payload.id, name: action.payload.name})
}

function showThingReducer (state, action) {
  window.alert(state.get(action.payload).name)
  return state
}

const things = handleActions({
  RECEIVE_THING_LIST: receiveThingListReducer,
  REQUEST_THING_LIST: requestThingListReducer,
  ADD_THING: addThingReducer,
  SHOW_THING_INFO: showThingReducer
}, immutable.List())

export default things
