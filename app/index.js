import React from 'react'
import * as ReactDOM from 'react-dom'
import * as redux from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import i18next from 'i18next'
import XHR from 'i18next-xhr-backend'

import stuffrApp from './reducers'
import App from './components/App'
import { getThingList } from './actions'
import { StuffrApi } from './stuffrapi'

import loadConfig from './config'

const logger = createLogger({collapsed: true})

let store = redux.createStore(stuffrApp, redux.compose(
  redux.applyMiddleware(thunk, logger),
  // Activate Redux dev tools if installed in browser
  // https://github.com/zalmoxisus/redux-devtools-extension
  window.devToolsExtension ? window.devToolsExtension() : (f) => f
))

i18next.use(XHR).init({
  lng: 'en',
  backend: {
    loadPath: '/locales/{{lng}}.json',
    addPath: '/locales/add/{{lng}}'
  }
}, (error, t) => {
  if (error !== undefined) {
    console.error('Error loading i18n: {error}')
  }
  runStuffr()
})

// Wrap init code in a function call to allow for async actions
async function runStuffr () {
  let config
  try {
    config = await loadConfig()
  } catch (e) {
    console.error(e)
    // TODO: actually do something here
  }

  global.stuffrapi = new StuffrApi(config.API_PATH)

  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('app')
  )

  store.dispatch(getThingList())
}
