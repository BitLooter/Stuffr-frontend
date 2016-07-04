import 'babel-polyfill'
import React from 'react'
import * as ReactDOM from 'react-dom'
import * as redux from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import stuffrApp from './reducers'
import App from './components/App'
import { fetchThingList } from './actions'

let store = redux.createStore(stuffrApp, redux.applyMiddleware(thunk))

store.dispatch(fetchThingList())

window.store = store

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('app')
)
