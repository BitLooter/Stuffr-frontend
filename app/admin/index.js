import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

import startup, { initAndDisplayErrors } from '../common/startup'
import reducer from './reducers'
import AdminApp from './components/AdminApp'
import { refreshServerInfo, refreshStats } from './actions'
import { setupApi } from '../stuffrapi'

initAndDisplayErrors(async () => {
  // If no token is available loadUser will trigger a login
  setupApi(global.siteConfig.apiPath, global.siteConfig.authPath,
    localStorage.apiToken)

  injectTapEventPlugin() // Needed for Material-UI
  const store = await startup(
    // MuiThemeProvider: Needed for Material-UI
    <MuiThemeProvider>
      <AdminApp />
    </MuiThemeProvider>,
    reducer,
    {i18nNS: 'admin'}
  )

  // TODO: Do not load user if no api token set
  // store.dispatch(loadUser())
  // TODO: Load stats on status panel select
  store.dispatch(refreshStats())
  store.dispatch(refreshServerInfo())

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
})
