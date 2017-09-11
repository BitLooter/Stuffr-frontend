import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

import startup, { initAndDisplayErrors } from '../startup'
import reducer from './reducers'
import AdminApp from './components/AdminApp'
// import { loadUser } from '../actions'
// import { setupApi } from '../stuffrapi'

// const initialState = {ui: {authenticated: true}}

initAndDisplayErrors(async () => {
  // If no token is available loadUser will trigger a login
  // setupApi(window.siteConfig.apiPath, window.siteConfig.authPath,
  //   window.localStorage.apiToken)

  injectTapEventPlugin() // Needed for Material-UI
  const store = await startup(
    // MuiThemeProvider: Needed for Material-UI
    <MuiThemeProvider>
      <AdminApp />
    </MuiThemeProvider>,
    reducer
  )
  store.dispatch({type: 'DO ADMIN STARTUP STUFF HERE'})

  // TODO: Do not load user if no api token set
  // store.dispatch(loadUser())

  // Set up HMR for dev server
  if (module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(reducer))
    module.hot.accept('./actions')
  //   // TODO: Test API reinitialization
  //   module.hot.accept('./stuffrapi', () => setupApi(
  //     window.siteConfig.apiPath, window.siteConfig.authPath,
  //     window.localStorage.apiToken
  //   ))
  }
})
