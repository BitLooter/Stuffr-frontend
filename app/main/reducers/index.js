import { combineReducers } from 'redux'

import auth from '../../common/reducers/auth'
import database from './database'
import ui from './ui'

const reducers = combineReducers({
  auth,
  database,
  ui
})

export default reducers
