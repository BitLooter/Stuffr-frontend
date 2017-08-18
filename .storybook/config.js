/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { configure, addDecorator } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import log from 'loglevel'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

import locale from '../app/locales/en'
import { i18nSetup } from '../app/i18n'
import store from '../stories/store'
import { setNullApi } from '../app/stuffrapi'

log.setLevel('debug')
setNullApi()
injectTapEventPlugin() // Needed for material-ui
window.siteConfig = {frontendVersion: 'STORYBOOK DEMO'}
i18nSetup({en: {translation: locale}}, {synchronous: true})

addDecorator( (story) =>
  <Provider store={store}>
    <MuiThemeProvider>
      {story()}
    </MuiThemeProvider>
  </Provider>
)

function loadStories() {
  require('../stories')
}

configure(loadStories, module)
