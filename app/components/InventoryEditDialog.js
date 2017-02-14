import React from 'react'
import {connect} from 'react-redux'
import i18next from 'i18next'
import log from 'loglevel'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import moment from 'moment'

import {ui, api} from '../actions'
import {isString, isEmpty} from '../util'
import FormDialogBase from './FormDialogBase'

const DIALOG_NEW = Symbol.for('ui.DIALOG_NEW')
const DIALOG_EDIT = Symbol.for('ui.DIALOG_EDIT')

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
export default class InventoryEditDialog extends FormDialogBase {
  static fields = ['name']

  constructor (props) {
    super(props, props.inventory)
    this.buttons = <div>
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

  handleDone = () => {
    if (this.validateForm()) {
      if (this.props.mode === DIALOG_EDIT) {
        const changedData = this.getChangedData()
        if (!isEmpty(changedData)) {
          log.info(`Updating existing inventory with id ${this.props.inventory.id}`)
          this.props.updateInventory(this.props.thing.id, changedData)
        }
      } else if (this.props.mode === DIALOG_NEW) {
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
    const title = this.props.mode === DIALOG_EDIT
      ? this.props.inventory.name : i18next.t('inventory.newTitle')
    const form = <div>
      <TextField name='name'
        floatingLabelText={i18next.t('inventory.name')}
        defaultValue={this.props.inventory.name}
        errorText={this.state.errors.name}
        onBlur={this.handleChange}
      /><br />
      {this.props.mode !== DIALOG_EDIT ? null : (<div>
        Date added: {moment(this.inventory.date_created).calendar()}
      </div>)}
    </div>
    return this.renderDialog(title, this.buttons, form, this.handleCancel)
  }
}
