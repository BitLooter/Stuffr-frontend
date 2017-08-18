import * as apiActions from '../app/actions/api'
import { action as storybookAction } from '@storybook/addon-actions'
import * as redux from 'redux'
import thunk from 'redux-thunk'
import state from './state'

const actionBlacklist = Object.keys(apiActions).concat(['@@redux/INIT'])
function logReducer (state, action) {
  // Acts as a null reducer that also posts info to the storybook action log
  if (!(actionBlacklist.includes(action.type))) {
    storybookAction(action.type)(action.payload)
  }
  return state
}
const store = redux.createStore(logReducer, state, redux.applyMiddleware(thunk))
export default store
