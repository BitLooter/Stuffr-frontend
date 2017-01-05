import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'
import log from 'loglevel'

// Constants
const emptyDatabase = Immutable({user: null, inventories: [], things: []})

// Reducers

function genericErrorReducer (state, action) {
  log.error(`${action.type}: ${action.payload}`)
  return state
}

function loadUserDoneReducer (state, action) {
  return state.set('user', Immutable(action.payload))
}

function purgeUserReducer (state, action) {
  return emptyDatabase
}

function getInventoryListDoneReducer (state, action) {
  return state.set('inventories', Immutable(action.payload))
}

function postInventoryDoneReducer (state, action) {
  const newInventories = state.inventories.concat(Immutable(action.payload))
  return state.set('inventories', newInventories)
}

function getThingListDoneReducer (state, action) {
  return state.set('things', Immutable(action.payload))
}

function postThingDoneReducer (state, action) {
  const newThings = state.things.concat(Immutable(action.payload))
  return state.set('things', newThings)
}

function updateThingDoneReducer (state, action) {
  const newThings = state.things.flatMap((t) => {
    if (t.id === action.payload.id) {
      return t.merge(action.payload.update, {deep: true})
    } else {
      return t
    }
  })
  return state.set('things', newThings)
}

function deleteThingDoneReducer (state, action) {
  const newThings = state.things.flatMap((t) => {
    if (t.id === action.payload) {
      return []
    } else {
      return t
    }
  })
  return state.set('things', newThings)
}

const things = handleActions({
  LOGIN_USER__ERROR: genericErrorReducer,
  LOAD_USER__DONE: loadUserDoneReducer,
  LOAD_USER__ERROR: genericErrorReducer,
  PURGE_USER: purgeUserReducer,
  GET_INVENTORY_LIST__DONE: getInventoryListDoneReducer,
  GET_INVENTORY_LIST__ERROR: genericErrorReducer,
  POST_INVENTORY__DONE: postInventoryDoneReducer,
  POST_INVENTORY__ERROR: genericErrorReducer,
  GET_THING_LIST__DONE: getThingListDoneReducer,
  GET_THING_LIST__ERROR: genericErrorReducer,
  POST_THING__DONE: postThingDoneReducer,
  POST_THING__ERROR: genericErrorReducer,
  UPDATE_THING__DONE: updateThingDoneReducer,
  UPDATE_THING__ERROR: genericErrorReducer,
  DELETE_THING__DONE: deleteThingDoneReducer,
  DELETE_THING__ERROR: genericErrorReducer
}, Immutable(emptyDatabase))

export default things
