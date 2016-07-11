import React from 'react'
import * as ReactDOM from 'react-dom'
import * as redux from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import stuffrApp from './reducers'
import App from './components/App'
import { fetchThingList } from './actions'
import { StuffrApi } from './stuffrapi'

const logger = createLogger()
global.stuffrapi = new StuffrApi('http://drwily:8080/api')

let store = redux.createStore(stuffrApp, redux.compose(
                                redux.applyMiddleware(thunk, logger),
                                // Activate Redux dev tools if installed in browser
                                // https://github.com/zalmoxisus/redux-devtools-extension
                                window.devToolsExtension ? window.devToolsExtension() : f => f
                              ))

store.dispatch(fetchThingList())

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('app')
)
