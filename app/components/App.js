import React from 'react'
import {connect} from 'react-redux'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAddIcon from 'material-ui/svg-icons/content/add'

import ThingList from './ThingList'
import AuthenticationManager from './AuthenticationManager'
import ThingEditDialog from './ThingEditDialog'
import InventoryEditDialog from './InventoryEditDialog'
import Menubar from './Menubar'
import {ui} from '../actions'

const THINGDIALOG_CLOSED = Symbol.for('ui.THINGDIALOG_CLOSED')
const INVENTORYDIALOG_CLOSED = Symbol.for('ui.INVENTORYDIALOG_CLOSED')

const App = ({thingDialogMode, thingDialogData,
              inventoryDialogMode, inventoryDialogData,
              onClickActionButton}) => {
  let dialog = null
  if (thingDialogMode !== THINGDIALOG_CLOSED) {
    dialog = <ThingEditDialog mode={thingDialogMode} thing={thingDialogData} />
  } else if (inventoryDialogMode !== INVENTORYDIALOG_CLOSED) {
    dialog = <InventoryEditDialog mode={inventoryDialogMode} inventory={inventoryDialogData} />
  }
  return (<div className='app'>
    <AuthenticationManager>
      <Menubar />
      <ThingList />
      <FloatingActionButton className='actionButton'
        onTouchTap={onClickActionButton}><ContentAddIcon />
      </FloatingActionButton>
      {dialog   /* Dialogs normally hidden */}
    </AuthenticationManager>
  </div>)
}

const AppContainer = connect(
  function mapStateToProps (state) {
    return {
      thingDialogMode: state.ui.thingDialog.mode,
      thingDialogData: state.ui.thingDialog.thing,
      inventoryDialogMode: state.ui.inventoryDialog.mode,
      inventoryDialogData: state.ui.inventoryDialog.inventory
    }
  },
  function mapDispatchToProps (dispatch) {
    return {
      onClickActionButton: () => { dispatch(ui.createNewThing()) }
    }
  }
)(App)
export default AppContainer
