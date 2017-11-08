// Main app startup code

import React from 'react'
import * as ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { AppContainer } from 'react-hot-loader'

import startup, { renderStartupErrors } from '../common/startup'
import { loadUser } from './actions'
import { restoreUser } from '../common/actions/auth'
import reducer from './reducers'
import App from './components/App'

renderStartupErrors(async () => {
  injectTapEventPlugin() // Needed for Material-UI
  const store = await startup(
    // MuiThemeProvider: Needed for Material-UI
    <MuiThemeProvider>
      <AppContainer>
        <App />
      </AppContainer>
    </MuiThemeProvider>,
    reducer,
    {i18nNS: 'main'}
  )

  // TODO: Do not load user if no api token set
  // TODO: Do not restore user until user sucessfully loads
  store.dispatch(restoreUser())
  store.dispatch(loadUser())

  // Set up HMR for dev server
  if (module.hot) {
    module.hot.accept('./components/App', () => { ReactDOM.render(App) })
    module.hot.accept('./reducers', () => store.replaceReducer(reducer))
    module.hot.accept('./actions')
  }
})
