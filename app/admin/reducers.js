import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'
import log from 'loglevel'

// TODO: Flatten state?
const initialState = {
  ui: {authenticated: true},
  activePanel: 'overview',
  stats: {numUsers: '???', numInventories: '???', numThings: '???'},
  serverInfo: {version: 'Loading...'}
}

// Reducers

function setPanelReducer (state, action) {
  return state.set('activePanel', action.payload)
}

function refreshStatsReducer (state, action) {
  return state.set('stats', action.payload)
}

function refreshServerInfoReducer (state, action) {
  return state.set('serverInfo', action.payload)
}

function genericErrorReducer (state, action) {
  log.error(`${action.type}: ${action.payload}`)
  return state
}

const reducer = handleActions({
  SET_PANEL: setPanelReducer,
  REFRESH_STATS__FINISH: refreshStatsReducer,
  REFRESH_STATS__ERROR: genericErrorReducer,
  REFRESH_SERVERINFO__FINISH: refreshServerInfoReducer,
  REFRESH_SERVERINFO__ERROR: genericErrorReducer
}, Immutable(initialState))

export default reducer
