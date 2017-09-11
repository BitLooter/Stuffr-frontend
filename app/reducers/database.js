import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'
import log from 'loglevel'

// Constants
const emptyDatabase = {user: null, inventories: [], things: []}

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

function getInventoriesDoneReducer (state, action) {
  return state.set('inventories', Immutable(action.payload))
}

function createInventoryDoneReducer (state, action) {
  const newInventories = state.inventories.concat(Immutable(action.payload))
  return state.set('inventories', newInventories)
}

function getThingsDoneReducer (state, action) {
  return state.set('things', Immutable(action.payload))
}

function postThingDoneReducer (state, action) {
  const newThings = state.things.concat(Immutable(action.payload))
  return state.set('things', newThings)
}

function putThingDoneReducer (state, action) {
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

const reducer = handleActions({
  LOAD_USER__FINISH: loadUserDoneReducer,
  LOAD_USER__ERROR: genericErrorReducer,
  PURGE_USER: purgeUserReducer,
  GET_INVENTORIES__DONE: getInventoriesDoneReducer,
  GET_INVENTORIES__ERROR: genericErrorReducer,
  POST_INVENTORY__DONE: createInventoryDoneReducer,
  POST_INVENTORY__ERROR: genericErrorReducer,
  GET_THINGS__DONE: getThingsDoneReducer,
  GET_THINGS__ERROR: genericErrorReducer,
  POST_THING__DONE: postThingDoneReducer,
  POST_THING__ERROR: genericErrorReducer,
  PUT_THING__DONE: putThingDoneReducer,
  PUT_THING__ERROR: genericErrorReducer,
  DELETE_THING__DONE: deleteThingDoneReducer,
  DELETE_THING__ERROR: genericErrorReducer
}, Immutable(emptyDatabase))

export default reducer
