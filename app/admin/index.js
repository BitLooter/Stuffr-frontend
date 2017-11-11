// Admin app startup code

import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

import startup, { renderStartupErrors } from '../common/startup'
import { restoreUser } from '../common/actions/auth'
import { selectPanel } from './actions'
import reducer from './reducers'
import AdminApp from './components/AdminApp'

renderStartupErrors(async () => {
  injectTapEventPlugin() // Needed for Material-UI
  const {store, rerender} = await startup(
    // MuiThemeProvider: Needed for Material-UI
    <MuiThemeProvider>
      <AdminApp />
    </MuiThemeProvider>,
    reducer,
    {i18nNS: ['admin', 'common']}
  )

  // TODO: Do not load user if no api token set
  // TODO: Do not restore user until user sucessfully loads
  store.dispatch(restoreUser())
  // store.dispatch(loadUser())
  selectPanel('overview')(store.dispatch)()

  // Set up HMR for dev server
  if (module.hot) {
    module.hot.accept('./components/AdminApp', rerender)
    module.hot.accept('./reducers', () => store.replaceReducer(reducer))
    module.hot.accept('./actions')
  }
})
