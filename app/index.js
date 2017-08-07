import React from 'react'
import * as ReactDOM from 'react-dom'
import * as redux from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import log from 'loglevel'
import i18next from 'i18next'
import i18nextFetch from 'i18next-fetch-backend'
import injectTapEventPlugin from 'react-tap-event-plugin'

import {loadUser} from './actions'
import reducer from './reducers'
import App from './components/App'
import {setupApi} from './stuffrapi'

injectTapEventPlugin() // Needed for material-ui

const logger = createLogger({collapsed: true})
log.setLevel(window.siteConfig.logLevel)
log.info(`Log level set to ${window.siteConfig.logLevel}`)

const store = redux.createStore(reducer, redux.compose(
  redux.applyMiddleware(thunk, logger),
  // Activate Redux dev tools if installed in browser
  // https://github.com/zalmoxisus/redux-devtools-extension
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
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

i18next.use(i18nextFetch).init({
  lng: 'en',
  fallbackLng: 'en',
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
})

// Wrap init code in a function call to allow for async actions
async function runStuffr (appElement) {
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
