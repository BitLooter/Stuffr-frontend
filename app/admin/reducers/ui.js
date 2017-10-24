import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'
import log from 'loglevel'

const initialState = Immutable({
  activePanel: 'overview'
})

// Reducers

function setPanelReducer (state, action) {
  log.info(`Switching to panel ${action.payload}`)
  return state.set('activePanel', action.payload)
}

const reducer = handleActions({
  SET_PANEL: setPanelReducer
}, initialState)

export default reducer
