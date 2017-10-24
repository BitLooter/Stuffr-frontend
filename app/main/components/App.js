import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAddIcon from 'material-ui/svg-icons/content/add'

import ThingList from './ThingList'
import AuthenticationManager from '../../common/components/AuthenticationManager'
import ThingEditDialog from './ThingEditDialog'
import InventoryEditDialog from './InventoryEditDialog'
import Menubar from './Menubar'
import { loadUser, openThingEditor } from '../actions'

const DIALOG_CLOSED = Symbol.for('ui.DIALOG_CLOSED')

function handlePostLogin (dispatch) {
  dispatch(loadUser())
}

const App = ({
  thingDialogMode, thingDialogData,
  inventoryDialogMode, inventoryDialogData,
  openThingEditor
}) => {
  let dialog = null
  if (thingDialogMode !== DIALOG_CLOSED) {
    dialog = <ThingEditDialog mode={thingDialogMode} thing={thingDialogData} />
  } else if (inventoryDialogMode !== DIALOG_CLOSED) {
    dialog = <InventoryEditDialog mode={inventoryDialogMode} inventory={inventoryDialogData} />
  }
  // TODO: app needs better offline handling
  return (<div className='app'>
    <AuthenticationManager onLogin={handlePostLogin}>
      <Menubar />
      <ThingList />
      <FloatingActionButton style={{position: 'fixed', bottom: '1em', right: '1em'}}
        onTouchTap={() => openThingEditor()}><ContentAddIcon />
      </FloatingActionButton>
      {dialog /* Dialogs normally hidden */}
    </AuthenticationManager>
  </div>)
}
App.propTypes = {
  thingDialogMode: PropTypes.symbol.isRequired,
  thingDialogData: PropTypes.object.isRequired,
  inventoryDialogMode: PropTypes.symbol.isRequired,
  inventoryDialogData: PropTypes.object.isRequired,
  openThingEditor: PropTypes.func.isRequired
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
  {openThingEditor}
)(App)
export default AppContainer
