import React from 'react'
import * as ReactDOM from 'react-dom'
import * as redux from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import log from 'loglevel'
import injectTapEventPlugin from 'react-tap-event-plugin'

import { loadUser } from './actions'
import reducer from './reducers'
import App from './components/App'
import { setupApi } from './stuffrapi'
import { i18nSetup } from './i18n'

injectTapEventPlugin() // Needed for material-ui

const reduxLogger = createLogger({collapsed: true})
log.setLevel(window.siteConfig.logLevel)
log.info(`Log level set to ${window.siteConfig.logLevel}`)

// Activate Redux dev tools if installed in browser
// https://github.com/zalmoxisus/redux-devtools-extension
const devToolComposer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : redux.compose
const store = redux.createStore(reducer, devToolComposer(
  redux.applyMiddleware(thunk, reduxLogger)
))

// Set up HMR
if (module.hot) {
  module.hot.accept('./reducers', () => store.replaceReducer(reducer))
  module.hot.accept('./actions')
  // TODO: Test API reinitialization
  module.hot.accept('./stuffrapi', () => setupApi(
    window.siteConfig.apiPath, window.siteConfig.authPath,
    window.localStorage.apiToken
  ))
}

const appElement = document.getElementById('app')
runStuffr(appElement).catch((e) => {
  // TODO: make this error display prettier
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

// Wrap init code in a function call to allow for async actions
async function runStuffr (appElement) {
  try {
    await i18nSetup({
      loadPath: '/locales/{{lng}}.json',
      addPath: '/locales/add/{{lng}}'
    })
  } catch (e) {
    log.error(`Error loading i18n: ${e}`)
    throw e
  }

  // If no token is available loadUser will trigger a login
  setupApi(window.siteConfig.apiPath, window.siteConfig.authPath,
    window.localStorage.apiToken)
  // TODO: Do not load user if no api token set
  store.dispatch(loadUser())

  ReactDOM.render(
    // Provider: Used to provide access to the Redux store in components
    // MuiThemeProvider: Needed for Material-UI
    <Provider store={store}>
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    </Provider>,
    appElement
  )
}
