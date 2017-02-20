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

const DIALOG_CLOSED = Symbol.for('ui.DIALOG_CLOSED')

const App = ({thingDialogMode, thingDialogData,
              inventoryDialogMode, inventoryDialogData,
              onClickActionButton}) => {
  let dialog = null
  if (thingDialogMode !== DIALOG_CLOSED) {
    dialog = <ThingEditDialog mode={thingDialogMode} thing={thingDialogData} />
  } else if (inventoryDialogMode !== DIALOG_CLOSED) {
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
App.propTypes = {
  thingDialogMode: React.PropTypes.symbol.isRequired,
  thingDialogData: React.PropTypes.object.isRequired,
  inventoryDialogMode: React.PropTypes.symbol.isRequired,
  inventoryDialogData: React.PropTypes.object.isRequired,
  onClickActionButton: React.PropTypes.func.isRequired
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
