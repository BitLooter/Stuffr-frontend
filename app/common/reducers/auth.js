/* Reducers to manage authentication information */

import { handleActions } from 'redux-actions'
import Immutable from 'seamless-immutable'

const noUser = Immutable({
  authenticated: false,
  loginError: undefined,
  registerError: undefined
})

function authorizationRequiredReducer (state, action) {
  return state.set('authenticated', false)
}

function authenticatedReducer (state, action) {
  return state.set('authenticated', true)
}

function loginErrorReducer (state, action) {
  // TODO: make login/register errors more user-friendly
  return state.set('loginError', action.payload.message)
}

function registerErrorReducer (state, action) {
  return state.set('registerError', action.payload.message)
}

function purgeUserReducer (state, action) {
  return noUser
}

const reducer = handleActions({
  AUTHORIZATION_REQUIRED: authorizationRequiredReducer,
  LOGIN_USER__FINISH: authenticatedReducer,
  LOGIN_USER__ERROR: loginErrorReducer,
  RESTORE_USER: authenticatedReducer,
  REGISTER_USER__FINISH: authenticatedReducer,
  REGISTER_USER__ERROR: registerErrorReducer,
  PURGE_USER: purgeUserReducer
}, noUser)

export default reducer
