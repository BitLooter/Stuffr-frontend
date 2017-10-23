import React from 'react'
import { Provider } from 'react-redux'
import i18next from 'i18next'
import { storiesOf } from '@storybook/react'
import { action as storybookAction } from '@storybook/addon-actions'

import locale from '../../app/locales/main/en.json'
import * as apiActions from '../../app/main/actions/api'
import state from './state'
import { createDemoStore } from '../store'

import LoginDialog from '../../app/common/components/LoginDialog'
import RegisterDialog from '../../app/common/components/RegisterDialog'

i18next.addResourceBundle('en', 'default', locale, true, true)

const actionBlacklist = Object.keys(apiActions)
const store = createDemoStore(state, actionBlacklist)

storiesOf('Common components', module)
  .addDecorator((story) =>
    <Provider store={store}>
      {story()}
    </Provider>
  )
  .add('Login dialog', () => <LoginDialog
    handleSwitchToRegister={storybookAction('Switch to register mode')} />)
  .add('Register dialog', () => <RegisterDialog
    handleSwitchToLogin={storybookAction('Switch to login mode')} />)
