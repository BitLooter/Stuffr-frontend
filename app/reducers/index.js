import { combineReducers } from 'redux'

import things from './things'
import ui from './ui'

const reducers = combineReducers({
  things,
  ui
})

export default reducers
