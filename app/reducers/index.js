import { combineReducers } from 'redux'
import { reducer as uiReducer } from 'redux-ui'

import things from './things'

const reducers = combineReducers({
  things,
  ui: uiReducer
})

export default reducers
