import React from 'react'
import { Provider } from 'react-redux'
import i18next from 'i18next'
import { storiesOf } from '@storybook/react'

import locale from '../../app/locales/admin/en.json'
import state from './state'
import { createDemoStore } from '../store'
import Sidebar from '../../app/admin/components/Sidebar'
import StatusPanel from '../../app/admin/components/StatusPanel'
import UserPanel from '../../app/admin/components/UserPanel'

i18next.addResourceBundle('en', 'default', locale, true, true)
const store = createDemoStore(state)

storiesOf('Admin components', module)
  .addDecorator((story) =>
    <Provider store={store}>
      {story()}
    </Provider>
  )
  .add('Sidebar', () => <Sidebar />)
  .add('Status panel', () => <StatusPanel />)
  .add('User Management panel', () => <UserPanel />)
