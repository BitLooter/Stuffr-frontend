import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'
import log from 'loglevel'

function genericErrorReducer (state, action) {
  log.error(`${action.type}: ${action.payload}`)
  return state
}

function getThingListDoneReducer (state, action) {
  return Immutable(action.payload)
}

function postThingDoneReducer (state, action) {
  return state.concat(Immutable(action.payload))
}

function updateThingDoneReducer (state, action) {
  const newState = state.flatMap((t) => {
    if (t.id === action.payload.id) {
      return t.merge(action.payload.update, {deep: true})
    } else {
      return t
    }
  })
  return newState
}

function deleteThingDoneReducer (state, action) {
  const newState = state.flatMap((t) => {
    if (t.id === action.payload) {
      return []
    } else {
      return t
    }
  })
  return newState
}

const things = handleActions({
  GET_THING_LIST__DONE: getThingListDoneReducer,
  GET_THING_LIST__ERROR: genericErrorReducer,
  POST_THING__DONE: postThingDoneReducer,
  POST_THING__ERROR: genericErrorReducer,
  UPDATE_THING__DONE: updateThingDoneReducer,
  UPDATE_THING__ERROR: genericErrorReducer,
  DELETE_THING__DONE: deleteThingDoneReducer,
  DELETE_THING__ERROR: genericErrorReducer
}, Immutable([]))

export default things
