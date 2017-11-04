import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import log from 'loglevel'

import startup, { initAndDisplayErrors } from '../common/startup'
import { loadUser } from './actions'
import reducer from './reducers'
import App from './components/App'
import { setupApi } from '../stuffrapi'

initAndDisplayErrors(async () => {
  // If no token is available loadUser will trigger a login
  log.info('INIT: Starting app setup...')
  setupApi(global.siteConfig.apiPath, global.siteConfig.authPath,
    localStorage.apiToken)

  injectTapEventPlugin() // Needed for Material-UI
  const store = await startup(
    // MuiThemeProvider: Needed for Material-UI
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>,
    reducer,
    {i18nNS: 'main'}
  )

  // TODO: Do not load user if no api token set
  store.dispatch(loadUser())

  // Set up HMR for dev server
  if (module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(reducer))
    module.hot.accept('./actions')
    // TODO: Test API reinitialization
    module.hot.accept('../stuffrapi', () => setupApi(
      global.siteConfig.apiPath, global.siteConfig.authPath,
      localStorage.apiToken
    ))
  }

  log.info('INIT: App setup complete')
})
