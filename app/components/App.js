import React from 'react'
import {connect} from 'react-redux'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import ThingList from './ThingList'
import AuthenticationManager from './AuthenticationManager'
import ThingEditDialog from './ThingEditDialog'
import InventoryEditDialog from './InventoryEditDialog'
import Menubar from './Menubar'
import {ui} from '../actions'

const App = ({thingDialogMode, thingDialogData,
              inventoryDialogMode, inventoryDialogData,
              onClickActionButton}) =>
  <div className='app'>
    <AuthenticationManager>
      <Menubar />
      <ThingList />
      {/* TODO: SVG icon in button */}
      <FloatingActionButton className='actionButton'
        onClick={onClickActionButton}>+</FloatingActionButton>
      {/* Dialogs (normally hidden) */}
      <ThingEditDialog mode={thingDialogMode} thing={thingDialogData} />
      <InventoryEditDialog mode={inventoryDialogMode} inventory={inventoryDialogData} />
    </AuthenticationManager>
  </div>

const AppContainer = connect(
  function mapStateToProps (state) {
    // TODO: ensure only one dialog open
    return {
      thingDialogMode: state.ui.thingDialog.mode,
      thingDialogData: state.ui.thingDialog.thing,
      inventoryDialogMode: state.ui.inventoryDialog.mode,
      inventoryDialogData: state.ui.inventoryDialog.inventory
    }
  },
  function mapDispatchToProps (dispatch) {
    // TODO: ensure only one dialog open
    return {
      onClickActionButton: () => { dispatch(ui.createNewThing()) }
    }
  }
)(App)
export default AppContainer
