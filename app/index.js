import React from 'react'
import * as ReactDOM from 'react-dom'
import * as redux from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import log from 'loglevel'
import i18next from 'i18next'
import XHR from 'i18next-xhr-backend'
import injectTapEventPlugin from 'react-tap-event-plugin'

import stuffrApp from './reducers'
import AppContainer from './containers/AppContainer'
import {setupApi} from './stuffrapi'

import loadConfig from './config'

injectTapEventPlugin()  // Needed for material-ui

const logger = createLogger({collapsed: true})

const store = redux.createStore(stuffrApp, redux.compose(
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
    log.error(`Error loading i18n: ${error}`)
  }
  const appElement = document.getElementById('app')
  runStuffr(appElement).catch((e) => {
    const errorElement = document.createElement('div')
    errorElement.innerHTML = `
      <h1>Whoops!</h1>
        <p>Something went wrong during setup.</p>
        <p>Technical details:</p>`
    const stackTraceElement = document.createElement('pre')
    stackTraceElement.appendChild(document.createTextNode(e.stack))
    errorElement.appendChild(stackTraceElement)
    appElement.parentNode.replaceChild(errorElement, appElement)
  })
})

// Wrap init code in a function call to allow for async actions
async function runStuffr (appElement) {
  let config
  try {
    config = await loadConfig()
  } catch (e) {
    log.error(`Error loading configuration file: ${e}`)
  }

  setupApi(config.API_PATH)

  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider>
        <AppContainer />
      </MuiThemeProvider>
    </Provider>,
    appElement
  )

  // TODO: Store last used/default inventory ID
}
