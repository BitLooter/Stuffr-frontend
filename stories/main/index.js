import React from 'react'
import { Provider } from 'react-redux'
import i18next from 'i18next'
import { storiesOf } from '@storybook/react'
import { action as storybookAction } from '@storybook/addon-actions'
import RaisedButton from 'material-ui/RaisedButton'

import locale from '../../app/locales/main/en.json'
import * as apiActions from '../../app/main/actions/api'
import state from './state'
import { createDemoStore } from '../store'
import { createThing } from '../../app/main/models'

import Menubar from '../../app/main/components/Menubar'
import ConfirmDialog, { withConfirmDialog } from '../../app/main/components/ConfirmDialog'
import InventoryEditDialog from '../../app/main/components/InventoryEditDialog'
import ThingList from '../../app/main/components/ThingList'
import ThingEditDialog from '../../app/main/components/ThingEditDialog'

i18next.addResourceBundle('en', 'default', locale, true, true)

const actionBlacklist = Object.keys(apiActions)
const store = createDemoStore(state, actionBlacklist)

const DIALOG_NEW = Symbol.for('ui.DIALOG_NEW')
const DIALOG_EDIT = Symbol.for('ui.DIALOG_EDIT')
const exampleThing = store.getState().database.things[0]
const newThing = createThing()

const ExampleConfirmButton = withConfirmDialog(({confirmWithUser}) => <RaisedButton
  primary={true} label='Show example confirm dialog'
  onClick={async () => {
    const userResponse = await confirmWithUser(
      'Confirm called by a function',
      `A component wrapped in withConfirmDialog has a prop that will display
      a confirmation dialog when called as a function.`)
    storybookAction('Confirm dialog choice')(userResponse)
  }} />)

storiesOf('Main view/Components', module)
  .addDecorator((story) =>
    <Provider store={store}>
      {story()}
    </Provider>
  )
  .add('Menu bar', () => <Menubar />)
  .add('Thing list', () => <ThingList />)

storiesOf('Main view/Dialogs', module)
  .addDecorator((story) =>
    <Provider store={store}>
      {story()}
    </Provider>
  )
  .add('Confirm dialog', () => <ConfirmDialog
    open={true}
    title={'Confirm Dialog'}
    text={'Used to get a positive or negative response from the user'}
    onYes={storybookAction('Yes clicked')}
    onNo={storybookAction('No clicked')} />)
  // TODO: Center button
  .add('Confirm dialog (Using HOC)', () => <ExampleConfirmButton />)
  .add('Thing edit', () => <ThingEditDialog mode={DIALOG_EDIT} thing={exampleThing} />)
  .add('Thing edit (new)', () => <ThingEditDialog mode={DIALOG_NEW} thing={newThing} />)
  .add('Inventory edit (new)', () => <InventoryEditDialog mode={DIALOG_NEW} inventory={newThing} />)
