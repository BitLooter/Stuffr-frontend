import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'
import log from 'loglevel'

const initialState = Immutable({
  stats: {numUsers: '???', numInventories: '???', numThings: '???'},
  info: {version: 'Loading...'},
  users: []
})

// Reducers

function refreshStatsReducer (state, action) {
  return state.set('stats', action.payload)
}

function refreshInfoReducer (state, action) {
  return state.set('info', action.payload)
}

function loadUsersReducer (state, action) {
  return state.set('users', action.payload)
}

function genericErrorReducer (state, action) {
  log.error(`${action.type}: ${action.payload}`)
  return state
}

const reducer = handleActions({
  REFRESH_STATS__FINISH: refreshStatsReducer,
  REFRESH_STATS__ERROR: genericErrorReducer,
  REFRESH_SERVERINFO__FINISH: refreshInfoReducer,
  REFRESH_SERVERINFO__ERROR: genericErrorReducer,
  LOAD_USERS__FINISH: loadUsersReducer,
  LOAD_USERS__ERROR: genericErrorReducer
}, initialState)

export default reducer
