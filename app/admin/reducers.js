import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'
// import log from 'loglevel'

// TODO: Flatten state?
const initialState = {ui: {authenticated: true}, activePanel: 'overview'}

// Reducers

function setPanelReducer (state, action) {
  return state.set('activePanel', action.payload)
}

// function genericErrorReducer (state, action) {
//   log.error(`${action.type}: ${action.payload}`)
//   return state
// }

const reducer = handleActions({
  SET_PANEL: setPanelReducer
}, Immutable(initialState))

export default reducer
