import React from 'react'
import { storiesOf } from '@storybook/react'

import Menubar from '../app/components/Menubar'
import ThingList from '../app/components/ThingList'

storiesOf('Main view components', module)
  .add('Menu bar', () => <Menubar />)
  .add('Thing list', () => <ThingList />)
