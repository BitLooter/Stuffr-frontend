import { handleActions } from 'redux-actions'
import * as immutable from 'immutable'
import log from 'loglevel'

function genericErrorReducer (state, action) {
  log.error(`${action.type}: ${action.payload}`)
  return state
}

function getThingListDoneReducer (state, action) {
  return immutable.List(action.payload)
}

function postThingDoneReducer (state, action) {
  return state.push({id: action.payload.id, name: action.payload.name})
}

function updateThingDoneReducer (state, action) {
  // Find existing thing and update it
  const [index] = state.findEntry((t) => t.id === action.payload.id)
  return state.set(index, {id: action.payload.id, name: action.payload.name})
}

const things = handleActions({
  GET_THING_LIST__DONE: getThingListDoneReducer,
  GET_THING_LIST__ERROR: genericErrorReducer,
  POST_THING__DONE: postThingDoneReducer,
  POST_THING__ERROR: genericErrorReducer,
  UPDATE_THING__DONE: updateThingDoneReducer,
  UPDATE_THING__ERROR: genericErrorReducer
}, immutable.List())

export default things
