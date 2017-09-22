// Common code used by multiple substories

import { action as storybookAction } from '@storybook/addon-actions'
import * as redux from 'redux'
import thunk from 'redux-thunk'

export function createDemoStore (initialState, actionBlacklist = []) {
  const fullBlacklist = actionBlacklist.concat(['@@redux/INIT'])
  function logReducer (state, action) {
    // Acts as a null reducer that also posts info to the storybook action log
    if (!(fullBlacklist.includes(action.type))) {
      storybookAction(action.type)(action.payload)
    }
    return state
  }
  // TODO: Better example state
  // TODO: Hot reloading for store
  return redux.createStore(logReducer, initialState, redux.applyMiddleware(thunk))
}
