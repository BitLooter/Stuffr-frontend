import React from 'react'
import { connect } from 'react-redux'
import log from 'loglevel'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import moment from 'moment'

import { closeThingEditor, submitThing, removeThing } from '../actions'
import t from '../i18n'
import { isString, isEmpty } from '../util'
import FormDialogBase from './FormDialogBase'
import ConfirmDialog from './ConfirmDialog'

const DIALOG_NEW = Symbol.for('ui.DIALOG_NEW')
const DIALOG_EDIT = Symbol.for('ui.DIALOG_EDIT')
const MULTILINE_ROWS = 3

@connect(
  function mapStateToProps (state) {
    return {
      currentInventoryId: state.database.inventories.length > 0
        ? state.database.inventories[state.ui.currentInventory].id
        : null
    }
  },
  {submitThing, removeThing, closeThingEditor}
)
export default class ThingEditDialog extends FormDialogBase {
  static fields = ['name', 'details', 'location']

  constructor (props) {
    super(props, props.thing)
    const thing = props.thing
    this.title = this.props.mode === DIALOG_EDIT ? thing.name : t('thing.newTitle')
    this.buttons = <div>
      { /* Hide delete button on new things */
        props.mode !== DIALOG_NEW
          ? <FlatButton
            style={{float: 'left'}}
            label={t('thing.delete')}
            onClick={this.handleDelete} />
          : null
      }
      <FlatButton
        label={t('common.cancel')}
        onClick={this.handleCancel}
      />
      { /* TODO: Disable button if nothing has been edited */ }
      <RaisedButton
        primary={true}
        label={t('common.save')}
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
        errors.name = t('thing.nameErrorMissing')
      }
    } else {
      log.error(`Name should be a string, found ${typeof data.name} instead`)
    }
    if (data.location !== null && !isString(data.location)) {
      log.error(`Location should be a string, found ${typeof data.location} instead`)
    }
    if (data.details !== null && !isString(data.details)) {
      log.error(`Details should be a string, found ${typeof data.details} instead`)
    }

    this.setState({errors})
    return isEmpty(errors)
  }

  handleDone = () => {
    if (this.validateForm()) {
      if (this.props.mode === DIALOG_EDIT) {
        const changedData = this.getChangedData()
        if (!isEmpty(changedData)) {
          log.info(`Updating existing thing with id ${this.props.thing.id}`)
          this.props.submitThing(changedData, null, this.props.thing.id)
        }
      } else if (this.props.mode === DIALOG_NEW) {
        const newData = this.state.data
        log.info(`Creating new thing named ${newData.name}`)
        this.props.submitThing(newData, this.props.currentInventoryId)
      } else {
        const errorMessage = `Unknown mode for ThingEditDialog: ${String(this.props.mode)}`
        log.error(errorMessage)
        throw new Error(errorMessage)
      }
    }
  }

  handleDelete = () => {
    // Do not confirm, if a mistake is made user can retrieve it from the trash
    this.props.removeThing(this.props.thing.id)
    this.props.closeThingEditor()
  }

  handleCancel = () => {
    // Show confirmation dialog if form data has changed
    if (!isEmpty(this.getChangedData())) {
      this.setState({confirm: {
        open: true,
        title: t('thing.confirmCancelTitle'),
        text: t('thing.confirmCancelText'),
        handleYes: this.props.closeThingEditor,
        handleNo: () => this.setState({confirm: {open: false}})
      }})
    } else {
      this.props.closeThingEditor()
    }
  }

  render () {
    const thing = this.props.thing
    const title = this.props.mode === DIALOG_EDIT ? thing.name : t('thing.newTitle')
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
        floatingLabelText={t('thing.name')}
        defaultValue={thing.name}
        errorText={this.state.errors.name}
        onBlur={this.handleChange} /><br />
      <TextField name='details'
        floatingLabelText={t('thing.details')}
        multiLine={true}
        rows={MULTILINE_ROWS} rowsMax={MULTILINE_ROWS}
        fullWidth={true}
        defaultValue={thing.details}
        onBlur={this.handleChange} /><br />
      {this.props.mode !== DIALOG_EDIT ? null : (<div>
        {t('thing.dateAdded')}: {moment(thing.date_created).calendar()}<br />
        {t('thing.dateModified')}: {moment(thing.date_modified).calendar()}
      </div>)}
      {confirmDialog}
    </div>
    return this.renderDialog(title, this.buttons, form, this.handleCancel)
  }
}
