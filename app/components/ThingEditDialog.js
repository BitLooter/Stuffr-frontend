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
import ConfirmDialog from './ConfirmDialog'

const THINGDIALOG_NEW = Symbol.for('ui.THINGDIALOG_NEW')
const THINGDIALOG_EDIT = Symbol.for('ui.THINGDIALOG_EDIT')
const MULTILINE_ROWS = 3

@connect(
  function mapStateToProps (state) {
    return {
      currentInventoryId: state.database.inventories.length > 0
        ? state.database.inventories[state.ui.currentInventory].id
        : null
    }
  },
  function mapDispatchToProps (dispatch) {
    return {
      createThing: (inventoryId, data) => { dispatch(api.postThing(inventoryId, data)) },
      updateThing: (thingId, data) => { dispatch(api.updateThing(thingId, data)) },
      deleteThing: (thingId) => { dispatch(api.deleteThing(thingId)) },
      closeDialog: () => { dispatch(ui.editThingDone()) }
    }
  }
)
export default class ThingEditDialog extends FormDialogBase {
  static fields = ['name', 'description', 'notes']

  constructor (props) {
    super(props, props.thing)
    const thing = props.thing
    this.title = this.props.mode === THINGDIALOG_EDIT ? thing.name : i18next.t('thing.newTitle')
    this.buttons = <div>
      { /* Hide delete button on new things */
        props.mode !== THINGDIALOG_NEW
        ? <FlatButton
            style={{float: 'left'}}
            label={i18next.t('thing.delete')}
            onClick={this.handleDelete} />
        : null
      }
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
    // Add confirm dialog info to state built in super()
    this.state.confirm = {
      open: false, title: 'NO TITLE', text: 'Confirm placeholder'
    }
  }

  validateForm = () => {
    const data = this.state.data
    const errors = {}

    if (isString(data.name)) {
      if (data.name.length === 0) {
        errors.name = i18next.t('thing.nameErrorMissing')
      }
    } else {
      log.error(`Name should be a string, found ${typeof data.name} instead`)
    }
    if (data.description !== null && !isString(data.description)) {
      log.error(`Description should be a string, found ${typeof data.description} instead`)
    }
    if (data.notes !== null && !isString(data.notes)) {
      log.error(`Notes should be a string, found ${typeof data.notes} instead`)
    }

    this.setState({errors})
    return isEmpty(errors)
  }

  handleDone = () => {
    // TODO: verify data
    if (this.validateForm()) {
      if (this.props.mode === THINGDIALOG_EDIT) {
        const changedData = this.getChangedData()
        if (!isEmpty(changedData)) {
          log.info(`Updating existing thing with id ${this.props.thing.id}`)
          this.props.updateThing(this.props.thing.id, changedData)
        }
      } else if (this.props.mode === THINGDIALOG_NEW) {
        const newData = this.state.data
        log.info(`Creating new thing named ${newData.name}`)
        this.props.createThing(this.props.currentInventoryId, newData)
      } else {
        const errorMessage = `Unknown mode for ThingEditDialog: ${String(this.props.mode)}`
        log.error(errorMessage)
        throw new Error(errorMessage)
      }
      this.props.closeDialog()
    }
  }

  handleDelete = () => {
    // Do not confirm, if a mistake is made user can retrieve it from the trash
    this.props.deleteThing(this.props.thing.id)
    this.props.closeDialog()
  }

  handleCancel = () => {
    // Show confirmation dialog if form data has changed
    if (!isEmpty(this.getChangedData())) {
      this.setState({confirm: {
        open: true,
        title: i18next.t('thing.confirmCancelTitle'),
        text: i18next.t('thing.confirmCancelText'),
        handleYes: this.props.closeDialog,
        handleNo: () => this.setState({confirm: {open: false}})
      }})
    } else {
      this.props.closeDialog()
    }
  }

  render () {
    const thing = this.props.thing
    const title = this.props.mode === THINGDIALOG_EDIT ? thing.name : i18next.t('thing.newTitle')
    const confirmDialog = this.state.confirm.open
      ? <ConfirmDialog
          open={this.state.confirm.open}
          title={this.state.confirm.title}
          text={this.state.confirm.text}
          onYes={() => { this.state.confirm.handleYes() }}
          onNo={() => { this.state.confirm.handleNo() }} />
      : null
    const form = <div>
      <TextField name='name'
        floatingLabelText={i18next.t('thing.name')}
        defaultValue={thing.name}
        errorText={this.state.errors.name}
        onBlur={this.handleChange} /><br />
      <TextField name='description'
        floatingLabelText={i18next.t('thing.description')}
        multiLine={true}
        rows={MULTILINE_ROWS} rowsMax={MULTILINE_ROWS}
        fullWidth={true}
        defaultValue={thing.description}
        onBlur={this.handleChange} /><br />
      <TextField name='notes'
        floatingLabelText={i18next.t('thing.notes')}
        multiLine={true}
        rows={MULTILINE_ROWS} rowsMax={MULTILINE_ROWS}
        fullWidth={true}
        defaultValue={thing.notes}
        onBlur={this.handleChange} /><br />
      {this.props.mode !== THINGDIALOG_EDIT ? null : (<div>
        {i18next.t('thing.dateAdded')}: {moment(thing.date_created).calendar()}<br />
        {i18next.t('thing.dateModified')}: {moment(thing.date_modified).calendar()}
      </div>)}
      {confirmDialog}
    </div>
    return this.renderDialog(title, this.buttons, form, this.handleCancel)
  }
}
