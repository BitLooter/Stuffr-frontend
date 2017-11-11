import { createAction } from 'redux-actions'
import log from 'loglevel'

import { createTaskThunk } from '../common/actions'
import stuffrApi from '../stuffrapi'

const SET_PANEL = 'SET_PANEL'
const setPanel = createAction(SET_PANEL)
const panelLoaderActions = {
  overview: (dispatch) => {
    dispatch(setPanel('overview'))
    dispatch(refreshStats())
    dispatch(refreshServerInfo())
  },
  userManagement: (dispatch) => {
    dispatch(setPanel('userManagement'))
    dispatch(loadUsers())
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

/* Server request actions
 *************************/

export const REFRESH_STATS__START = 'REFRESH_STATS__START'
export const refreshStatsStart = createAction(REFRESH_STATS__START)
export const REFRESH_STATS__FINISH = 'REFRESH_STATS__FINISH'
export const refreshStatsFinish = createAction(REFRESH_STATS__FINISH)
export const REFRESH_STATS__ERROR = 'REFRESH_STATS__ERROR'
export const refreshStatsError = createAction(REFRESH_STATS__ERROR)
export const refreshStats = createTaskThunk(
  async function () {
    return stuffrApi.adminGetStats()
  },
  refreshStatsStart, refreshStatsFinish, refreshStatsError
)

export const REFRESH_SERVERINFO__START = 'REFRESH_SERVERINFO__START'
export const refreshServerInfoStart = createAction(REFRESH_SERVERINFO__START)
export const REFRESH_SERVERINFO__FINISH = 'REFRESH_SERVERINFO__FINISH'
export const refreshServerInfoFinish = createAction(REFRESH_SERVERINFO__FINISH)
export const REFRESH_SERVERINFO__ERROR = 'REFRESH_SERVERINFO__ERROR'
export const refreshServerInfoError = createAction(REFRESH_SERVERINFO__ERROR)
export const refreshServerInfo = createTaskThunk(
  async function () {
    return stuffrApi.getServerInfo()
  },
  refreshServerInfoStart, refreshServerInfoFinish, refreshServerInfoError
)

export const LOAD_USERS__START = 'LOAD_USERS__START'
export const loadUsersStart = createAction(LOAD_USERS__START)
export const LOAD_USERS__FINISH = 'LOAD_USERS__FINISH'
export const loadUsersFinish = createAction(LOAD_USERS__FINISH)
export const LOAD_USERS__ERROR = 'LOAD_USERS__ERROR'
export const loadUsersError = createAction(LOAD_USERS__ERROR)
export const loadUsers = createTaskThunk(
  async function () {
    return stuffrApi.adminGetUsers()
  },
  loadUsersStart, loadUsersFinish, loadUsersError
)
