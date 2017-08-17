import React from 'react'
import * as redux from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import log from 'loglevel'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { storiesOf } from '@storybook/react'
import { action as storybookAction } from '@storybook/addon-actions'
import injectTapEventPlugin from 'react-tap-event-plugin'

import state from './state'
import { setNullApi } from '../app/stuffrapi'
import * as apiActions from '../app/actions/api'
import locale from '../app/locales/en'
import { i18nSetup } from '../app/i18n'
import Menubar from '../app/components/Menubar'

injectTapEventPlugin() // Needed for material-ui
window.siteConfig = {frontendVersion: 'STORYBOOK DEMO'}

log.setLevel('debug')
setNullApi()

const actionBlacklist = Object.keys(apiActions).concat(['@@redux/INIT'])
function logReducer (state, action) {
  // Acts as a null reducer that also posts info to the storybook action log
  if (!(actionBlacklist.includes(action.type))) {
    storybookAction(action.type)(action.payload)
  }
  return state
}
const store = redux.createStore(logReducer, state, redux.applyMiddleware(thunk))

i18nSetup({en: {translation: locale}}, {synchronous: true})

storiesOf('Menu bar', module)
  .add('Menu bar example', () => {
    return (
      <Provider store={store}>
        <MuiThemeProvider>
          <Menubar />
        </MuiThemeProvider>
      </Provider>
    )
  })
