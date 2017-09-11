import { createAction } from 'redux-actions'
import log from 'loglevel'

const SET_PANEL = 'SET_PANEL'
const setPanel = createAction(SET_PANEL)
const panelLoaderActions = {
  overview: (dispatch) => {
    dispatch(setPanel('overview'))
  },
  userManagement: (dispatch) => {
    dispatch(setPanel('userManagement'))
  },
  adminManagement: (dispatch) => {
    dispatch(setPanel('adminManagement'))
  }
}

export function selectPanel (panelName) {
  return function (dispatch) {
    if (!(panelName in panelLoaderActions)) {
      const error = `Unknown panel name ${panelName}`
      log.error(error)
      throw new Error(error)
    }
    return function () {
      dispatch(panelLoaderActions[panelName])
    }
  }
}
