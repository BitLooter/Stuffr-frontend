import { combineReducers } from 'redux'

import database from './database'
import ui from './ui'

const reducers = combineReducers({
  database,
  ui
})

export default reducers
