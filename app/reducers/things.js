import { handleActions } from 'redux-actions'
import * as immutable from 'immutable'

function genericErrorReducer (state, action) {
  // TODO: log this error instead of printing to console
  console.error(action.payload)
  return state
}

function getThingListRequestReducer (state, action) {
  return state
}

function getThingListDoneReducer (state, action) {
  return immutable.List(action.payload)
}

function postThingDoneReducer (state, action) {
  return state.push({id: action.payload.id, name: action.payload.name})
}

function showThingReducer (state, action) {
  window.alert(state.get(action.payload).name)
  return state
}

const things = handleActions({
  GET_THING_LIST__REQUEST: getThingListRequestReducer,
  GET_THING_LIST__DONE: getThingListDoneReducer,
  GET_THING_LIST__ERROR: genericErrorReducer,
  POST_THING__DONE: postThingDoneReducer,
  SHOW_THING_INFO: showThingReducer
}, immutable.List())

export default things
