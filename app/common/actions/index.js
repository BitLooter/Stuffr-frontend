/* Common code for common actions
**********************************/

import HttpStatus from 'http-status'

import { authorizationRequired } from './auth'

/* Generic thunk creator for tasks that take a significant amount of time to
complete, e.g. those that make network requests. *Action parameters should
be the appropriate action creators, and apiFunction is an async function
that makes the request. apiFunction is called with the parameters given
to the thunk and doneAction is dispatched with the apiFunction's return
value. */
export function createTaskThunk (apiFunction, requestAction, doneAction, errorAction) {
  return function (...apiParams) {
    return async function (dispatch, getState) {
      dispatch(requestAction())
      try {
        const response = await apiFunction({dispatch, getState}, ...apiParams)
        dispatch(doneAction(response))
        return response
      } catch (error) {
        dispatch(errorAction(error))
        if (error.status === HttpStatus.UNAUTHORIZED) {
          dispatch(authorizationRequired())
        }
      }
    }
  }
}
