import React from 'react'
import * as ReactDOM from 'react-dom'
import * as redux from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import log from 'loglevel'

import { i18nSetup } from './i18n'

export default async function startup (appComponent, reducer) {
  log.setLevel(window.siteConfig.logLevel)
  log.info(`Log level set to ${window.siteConfig.logLevel}`)

  // Activate Redux dev tools if installed in browser
  // https://github.com/zalmoxisus/redux-devtools-extension
  const devToolComposer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : redux.compose
  const reduxLogger = createLogger({collapsed: true})
  const store = redux.createStore(reducer, devToolComposer(
    redux.applyMiddleware(thunk, reduxLogger)
  ))

  try {
    await i18nSetup({loadPath: 'locales/{{lng}}.json'})
  } catch (e) {
    log.error(`Error loading i18n: ${e}`)
    throw e
  }

  const appElement = document.getElementById('app')
  // Provider: Used to provide access to the Redux store in components
  ReactDOM.render(
    <Provider store={store}>
      {appComponent}
    </Provider>,
    appElement)

  return store
}

// Convenience function to run startup code and display any fatal errors.
// Takes a function that performs app startup actions and returns a promise.
export function initAndDisplayErrors (initFunc) {
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
