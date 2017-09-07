import React from 'react'
import { storiesOf } from '@storybook/react'
import { action as storybookAction } from '@storybook/addon-actions'
import RaisedButton from 'material-ui/RaisedButton'

import store from './store'
import { createThing } from '../app/models'

import Menubar from '../app/components/Menubar'
import ConfirmDialog, { withConfirmDialog } from '../app/components/ConfirmDialog'
import InventoryEditDialog from '../app/components/InventoryEditDialog'
import LoginDialog from '../app/components/LoginDialog'
import RegisterDialog from '../app/components/RegisterDialog'
import ThingList from '../app/components/ThingList'
import ThingEditDialog from '../app/components/ThingEditDialog'

const DIALOG_NEW = Symbol.for('ui.DIALOG_NEW')
const DIALOG_EDIT = Symbol.for('ui.DIALOG_EDIT')
const exampleThing = store.getState().database.things[0]
const newThing = createThing()

const ExampleConfirmButton = withConfirmDialog(({confirmWithUser}) => <RaisedButton
  primary={true} label='Show example confirm dialog'
  onClick={async () => {
    const userResponse = await confirmWithUser(
      'Title of confirm dialog',
      'Explanatory text here.')
    storybookAction('Confirm dialog choice')(userResponse)
  }} />)

storiesOf('Main view components', module)
  .add('Menu bar', () => <Menubar />)
  .add('Thing list', () => <ThingList />)

storiesOf('Dialogs', module)
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
  .add('Login dialog', () => <LoginDialog
    handleSwitchToRegister={storybookAction('Switch to register mode')} />)
  .add('Register dialog', () => <RegisterDialog
    handleSwitchToLogin={storybookAction('Switch to login mode')} />)
