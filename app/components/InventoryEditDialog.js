import React from 'react'
import {connect} from 'react-redux'
import i18next from 'i18next'
import log from 'loglevel'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import moment from 'moment'

import {submitInventory, closeInventoryEditor} from '../actions'
import {isString, isEmpty} from '../util'
import FormDialogBase from './FormDialogBase'

const DIALOG_NEW = Symbol.for('ui.DIALOG_NEW')
const DIALOG_EDIT = Symbol.for('ui.DIALOG_EDIT')

@connect(
  undefined,
  function mapDispatchToProps (dispatch) {
    return {
      updateInventory: (data, id) => { dispatch(submitInventory(data, id)) },
      createInventory: (data) => { dispatch(submitInventory(data)) },
      closeDialog: () => { dispatch(closeInventoryEditor()) }
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
          this.props.updateInventory(changedData, this.props.thing.id)
        }
      } else if (this.props.mode === DIALOG_NEW) {
        log.info(`Creating new inventory named ${this.state.data.name}`)
        this.props.createInventory(this.state.data)
      } else {
        const errorMessage = `Unknown mode for InventoryEditDialog: ${String(this.props.mode)}`
        log.error(errorMessage)
        throw new Error(errorMessage)
      }
      // TODO: some sort of loading animation while waiting on the HTTP request
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
