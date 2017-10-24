import { combineReducers } from 'redux'

import auth from '../../common/reducers/auth'
import server from './server'
import ui from './ui'

const reducers = combineReducers({
  auth,
  server,
  ui
})

export default reducers
