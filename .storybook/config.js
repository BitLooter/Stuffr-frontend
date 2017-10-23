/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { configure, addDecorator } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import log from 'loglevel'
import { muiTheme } from 'storybook-addon-material-ui'
import injectTapEventPlugin from 'react-tap-event-plugin'

import { setNullApi } from '../app/stuffrapi'
import { i18nSetup } from '../app/common/i18n'

log.setLevel('debug')
// Storybook does not make any remote network requests
setNullApi()
window.siteConfig = {frontendVersion: 'STORYBOOK DEMO'}
i18nSetup({en: {dummy: {Resources: 'are loaded later'}}}, 'default', {synchronous: true})

addDecorator( muiTheme() )

function loadStories() {
  require('../stories/common')
  require('../stories/main')
  require('../stories/admin')
}

configure(loadStories, module)
