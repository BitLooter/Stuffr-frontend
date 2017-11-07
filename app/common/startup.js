// Common startup code for all of Stuffr's apps

import React from 'react'
import * as ReactDOM from 'react-dom'
import * as redux from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import log from 'loglevel'

import { i18nSetup } from './i18n'
import { setupApi } from '../stuffrapi'

function initStuffrApi () {
  setupApi(global.siteConfig.apiPath, global.siteConfig.authPath,
    localStorage.apiToken)
}

export default async function startup (appComponent, reducer, {i18nNS} = {}) {
  log.setLevel(global.siteConfig.logLevel)
  log.info(`Log level set to ${global.siteConfig.logLevel}`)
  log.info('INIT: Starting app setup...')

  initStuffrApi()

  // Activate Redux dev tools if installed in browser
  // https://github.com/zalmoxisus/redux-devtools-extension
  const devToolComposer = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : redux.compose
  const reduxLogger = createLogger({collapsed: true})
  const store = redux.createStore(reducer, devToolComposer(
    redux.applyMiddleware(thunk, reduxLogger)
  ))

  // Load translation data if a namespace was specified
  if (i18nNS) {
    try {
      await i18nSetup({loadPath: 'locales/{{ns}}/{{lng}}.json'}, i18nNS)
      log.info(`Successfully loaded locale en:${i18nNS}`)
    } catch (e) {
      log.error(`Error loading i18n: ${e}`)
      throw e
    }
  }

  const appElement = document.getElementById('app')
  // Provider: Used to provide access to the Redux store in components
  ReactDOM.render(
    <Provider store={store}>
      {appComponent}
    </Provider>,
    appElement)

  // Set up HMR for dev server for common code
  if (module.hot) {
    // TODO: Test API reinitialization
    module.hot.accept('../stuffrapi', initStuffrApi)
  }

  log.info('INIT: App setup complete')
  return store
}

// Convenience function to run startup code and display any fatal errors.
// Takes a function that performs app startup actions and returns a promise.
export function renderStartupErrors (initFunc) {
  initFunc().catch(renderStacktrace)
}

function renderStacktrace (e) {
  // TODO: make this error display prettier
  const errorElement = document.createElement('div')
  errorElement.innerHTML = `
    <h1>Whoops!</h1>
      <p>Something went wrong during setup.</p>
      <p>Technical details:</p>`
  const stackTraceElement = document.createElement('pre')
  stackTraceElement.appendChild(document.createTextNode(e.stack))
  errorElement.appendChild(stackTraceElement)
  document.body.innerHTML = ''
  document.body.appendChild(errorElement)
}
