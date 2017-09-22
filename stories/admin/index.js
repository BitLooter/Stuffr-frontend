import React from 'react'
import { Provider } from 'react-redux'
import i18next from 'i18next'
import { storiesOf } from '@storybook/react'

import locale from '../../app/locales/admin/en'
import state from './state'
import { createDemoStore } from '../common'
import Sidebar from '../../app/admin/components/Sidebar'

i18next.addResourceBundle('en', 'default', locale, true, true)
const store = createDemoStore(state)

storiesOf('Admin components', module)
  .addDecorator((story) =>
    <Provider store={store}>
      {story()}
    </Provider>
  )
  .add('Sidebar', () => <Sidebar />)
