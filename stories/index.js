import React from 'react'
import * as redux from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import log from 'loglevel'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import i18next from 'i18next'
import { storiesOf } from '@storybook/react'
import injectTapEventPlugin from 'react-tap-event-plugin'

import state from './state'
import reducer from '../app/reducers'
import locale from '../app/locales/en'
import Menubar from '../app/components/Menubar'

injectTapEventPlugin() // Needed for material-ui
window.siteConfig = {
  frontendVersion: 'STORYBOOK DEMO',
  logLevel: 'debug'
}

const store = redux.createStore(reducer, state, redux.applyMiddleware(thunk))
i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {locale}
}, (error, t) => {
  if (error) {
    log.error(`i18next: ${error}`)
  }
  storiesOf('Menu bar', module)
    .add('Menu bar example', () =>
      <Provider store={store}>
        <MuiThemeProvider>
          <Menubar></Menubar>
        </MuiThemeProvider>
      </Provider>
    )
})
