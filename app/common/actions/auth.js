/* Actions relating to authentication
 *************************************/

import { createAction } from 'redux-actions'
import log from 'loglevel'

import { createTaskThunk } from './'
import stuffrApi from '../../stuffrapi'
import { authTokenKey } from '../../util'

// Places the API token where it can be retrieved for later sessions
function storeToken (token) {
  localStorage[authTokenKey] = token
}

/* Event actions
*****************/
export const AUTHORIZATION_REQUIRED = 'AUTHORIZATION_REQUIRED'
export const authorizationRequired = createAction(AUTHORIZATION_REQUIRED)

/* Task actions
****************/

// Actions to log a user into the server
export const LOGIN_USER__START = 'LOGIN_USER__START'
export const loginUserStart = createAction(LOGIN_USER__START)
export const LOGIN_USER__FINISH = 'LOGIN_USER__FINISH'
export const loginUserFinish = createAction(LOGIN_USER__FINISH)
export const LOGIN_USER__ERROR = 'LOGIN_USER__ERROR'
export const loginUserError = createAction(LOGIN_USER__ERROR)
// loginUser - Perform user login and initial client setup.
// Parameters:
//  email: Login ID
//  password: Make a wild guess
// Returns:
//  User info object
export const loginUser = createTaskThunk(
  async function ({dispatch, getState}, email, password) {
    log.info(`loginUser: Logging in user ${email}`)
    await stuffrApi.login(email, password)
    storeToken(stuffrApi.token)
  },
  loginUserStart, loginUserFinish, loginUserError
)

// Reload a logged in user with existing auth token
export const RESTORE_USER = 'RESTORE_USER'
export const restoreUser = createAction(RESTORE_USER)

// Actions to register a new user
export const REGISTER_USER__START = 'REGISTER_USER__START'
export const registerUserStart = createAction(REGISTER_USER__START)
export const REGISTER_USER__FINISH = 'REGISTER_USER__FINISH'
export const registerUserFinish = createAction(REGISTER_USER__FINISH)
export const REGISTER_USER__ERROR = 'REGISTER_USER__ERROR'
export const registerUserError = createAction(REGISTER_USER__ERROR)
// registerUser - Perform user registration
// Parameters:
//  newUserData: Object containing information on new user
export const registerUser = createTaskThunk(
  async function ({dispatch, getState}, newUserData) {
    log.info('registerUser: Registering new user')
    await stuffrApi.registerUser(newUserData)
    storeToken(stuffrApi.token)
  },
  registerUserStart, registerUserFinish, registerUserError
)

// Actions to log a user out and remove all their data from the client
export const PURGE_USER = 'PURGE_USER'
export const purgeUser = createAction(PURGE_USER)
// logoutUser - Log the user out and clean up
export const logoutUser = function () {
  return function (dispatch) {
    log.info('purgeUser: Purging user data')
    stuffrApi.logout()
    delete localStorage[authTokenKey]
    delete localStorage.lastInventoryId
    // Reducers use purgeUser to clean user data from state
    dispatch(purgeUser())
  }
}

// Actions to reset a user's password
export const RESET_PASSWORD__START = 'RESET_PASSWORD__START'
export const resetPasswordStart = createAction(RESET_PASSWORD__START)
export const RESET_PASSWORD__FINISH = 'RESET_PASSWORD__FINISH'
export const resetPasswordFinish = createAction(RESET_PASSWORD__FINISH)
export const RESET_PASSWORD__ERROR = 'RESET_PASSWORD__ERROR'
export const resetPasswordError = createAction(RESET_PASSWORD__ERROR)
// resetPassword - Request a password reset
// Parameters:
//  email: Login ID
export const resetPassword = createTaskThunk(
  async function ({dispatch, getState}, email) {
    log.info('resetPassword: Submitting password reset request')
    await stuffrApi.resetPassword(email)
  },
  resetPasswordStart, resetPasswordFinish, resetPasswordError
)
