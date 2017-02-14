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
import {isString, isEmpty} from '../util'

const INVENTORYDIALOG_NEW = Symbol.for('ui.INVENTORYDIALOG_NEW')
const INVENTORYDIALOG_EDIT = Symbol.for('ui.INVENTORYDIALOG_EDIT')
const INVENTORYDIALOG_CLOSED = Symbol.for('ui.INVENTORYDIALOG_CLOSED')

@connect(
  undefined,
  function mapDispatchToProps (dispatch) {
    return {
      updateInventory: (id, data) => { dispatch(api.updateInventory(id, data)) },
      postInventory: (data) => { dispatch(api.postInventory(data)) },
      closeDialog: () => { dispatch(ui.editInventoryDone()) }
    }
  }
)
export default class InventoryEditDialog extends React.Component {
  static proptypes = { dispatch: React.PropTypes.func.isRequired }

  constructor (props) {
    super(props)
    this.state = {
      data: {
        name: props.inventory.name
      },
      errors: {}
    }
  }

  validateForm = () => {
    const data = this.state.data
    const errors = {}

    if (isString(data.name)) {
      if (data.name.length === 0) {
        errors.name = i18next.t('inventory.nameErrorMissing')
      }
    } else {
      log.error(`Name should be a string, found ${typeof data.name} instead`)
    }

    this.setState({errors})
    return isEmpty(errors)
  }

  getChangedData = () => {
    const FIELDS = ['name']
    const currentData = this.state.data
    const originalData = this.props.inventory
    const changedData = {}
    for (const field of FIELDS) {
      // Nullable/undefined field === empty string in editor
      const currentField = currentData[field] ? currentData[field] : null
      const originalField = originalData[field] ? originalData[field] : null
      if (currentField !== originalField) {
        changedData[field] = currentField
      }
    }
    return changedData
  }

  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    const newData = {[name]: value}
    this.setState({data: {...this.state.data, ...newData}})
  }

  handleDone = () => {
    if (this.validateForm()) {
      if (this.props.mode === INVENTORYDIALOG_EDIT) {
        const changedData = this.getChangedData()
        if (!isEmpty(changedData)) {
          log.info(`Updating existing inventory with id ${this.props.inventory.id}`)
          this.props.updateInventory(this.props.thing.id, changedData)
        }
      } else if (this.props.mode === INVENTORYDIALOG_NEW) {
        log.info(`Creating new inventory named ${this.state.data.name}`)
        // TODO: Switch to new inventory after creation
        this.props.postInventory(this.state.data)
      } else {
        const errorMessage = `Unknown mode for InventoryEditDialog: ${String(this.props.mode)}`
        log.error(errorMessage)
        throw new Error(errorMessage)
      }
      this.props.closeDialog()
    }
  }

  handleCancel = () => {
    // Inventory form is very simple, do not bother with a confirmation
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
        <TextField name='name'
          floatingLabelText={i18next.t('inventory.name')}
          defaultValue={inventory.name}
          errorText={this.state.errors.name}
          onBlur={this.handleChange}
        /><br />
        {this.props.mode !== INVENTORYDIALOG_EDIT ? null : (<div>
          Date added: {moment(inventory.date_created).calendar()}
        </div>)}
      </Dialog>
    )
  }
}
