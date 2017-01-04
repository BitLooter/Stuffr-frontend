import React from 'react'
import {connect} from 'react-redux'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import ThingList from './ThingList'
import ThingEditDialog from './ThingEditDialog'
import InventoryEditDialog from './InventoryEditDialog'
import Menubar from './Menubar'
import {ui} from '../actions'

const App = ({dispatch, thingDialogMode, thingDialogData,
              inventoryDialogMode, inventoryDialogData}) =>
  <div className='app'>
    <Menubar />
    <ThingList />
    <ThingEditDialog mode={thingDialogMode} thing={thingDialogData} />
    <InventoryEditDialog mode={inventoryDialogMode} inventory={inventoryDialogData} />
    <FloatingActionButton className='actionButton' onClick={() =>
      dispatch(ui.createNewThing())}>+</FloatingActionButton>
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
  }
)(App)
export default AppContainer
