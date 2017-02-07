import React from 'react'
import {connect} from 'react-redux'
import i18next from 'i18next'
import log from 'loglevel'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import moment from 'moment'

import {ui, api} from '../actions'

const INVENTORYDIALOG_NEW = Symbol.for('ui.INVENTORYDIALOG_NEW')
const INVENTORYDIALOG_EDIT = Symbol.for('ui.INVENTORYDIALOG_EDIT')
const INVENTORYDIALOG_CLOSED = Symbol.for('ui.INVENTORYDIALOG_CLOSED')

@connect(
  undefined,
  function mapDispatchToProps (dispatch) {
    return {
      updateInventory: (inventoryId, data) => {
        dispatch(api.updateInventory(inventoryId, data))
      },
      postInventory: (data) => { dispatch(api.postInventory(data)) },
      closeDialog: () => { dispatch(ui.editInventoryDone()) }
    }
  }
)
export default class InventoryEditDialog extends React.Component {
  static proptypes = { dispatch: React.PropTypes.func.isRequired }

  constructor (props) {
    super(props)
    this.originalInventory = props.inventory
  }

  getInventoryData = () => {
    return {
      name: this.refs.inventoryName.getValue()
    }
  }

  dataChanged = () => {
    const currentData = this.getInventoryData()
  }

  handleDone = () => {
    // TODO: check that data changed before submitting
    // TODO: verify data
    if (this.props.mode === INVENTORYDIALOG_EDIT) {
      const updateData = this.getInventoryData()
      log.info(`Updating existing inventory named ${updateData.name}`)
      this.props.updateInventory(this.props.thing.id, updateData)
    } else if (this.props.mode === INVENTORYDIALOG_NEW) {
      const newData = this.getInventoryData()
      log.info(`Creating new inventory named ${newData.name}`)
      // TODO: Switch to new inventory after creation
      this.props.postInventory(newData)
    } else {
      const errorMessage = `Unknown mode for InventoryEditDialog: ${String(this.props.mode)}`
      log.error(errorMessage)
      throw new Error(errorMessage)
    }
    this.props.closeDialog()
  }

  handleCancel = () => {
    // TODO: Confirm cancel if data changed
    this.props.closeDialog()
  }

  render () {
    const inventory = this.props.inventory
    const buttons = [
      <div>
        <FlatButton
          label={i18next.t('common.cancel')}
          onClick={this.handleCancel}
        />
        <RaisedButton
          primary={true}
          label={i18next.t('common.save')}
          onClick={this.handleDone}
        />
      </div>
    ]
    return (
      <Dialog
        title={this.props.mode === INVENTORYDIALOG_EDIT ? inventory.name : i18next.t('inventory.newTitle')}
        actions={buttons}
        open={this.props.mode !== INVENTORYDIALOG_CLOSED}
        onRequestClose={this.handleCancel}
      >
        <TextField name='inventoryName' ref='inventoryName'
          floatingLabelText={i18next.t('inventory.name')}
          defaultValue={inventory.name} /><br />
        {this.props.mode !== INVENTORYDIALOG_EDIT ? null : (<div>
          Date added: {moment(inventory.date_created).calendar()}
        </div>)}
      </Dialog>
    )
  }
}
