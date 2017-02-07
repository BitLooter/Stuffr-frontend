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
import ConfirmDialog from './ConfirmDialog'

const THINGDIALOG_NEW = Symbol.for('ui.THINGDIALOG_NEW')
const THINGDIALOG_EDIT = Symbol.for('ui.THINGDIALOG_EDIT')
const THINGDIALOG_CLOSED = Symbol.for('ui.THINGDIALOG_CLOSED')
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
      createThing: (inventoryId, data) => {
        dispatch(api.postThing(inventoryId, data))
      },
      updateThing: (thingId, data) => {
        dispatch(api.updateThing(thingId, data))
      },
      closeDialog: () => {
        dispatch(ui.editThingDone())
      }
    }
  }
)
export default class ThingEditDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {
        name: props.thing.name,
        description: props.thing.description,
        notes: props.thing.notes
      },
      confirm: {
        open: false, title: 'NO TITLE', text: 'ThingEditDialog Confirm placeholder'
      }
    }
  }

  getChangedData = () => {
    const FIELDS = ['name', 'description', 'notes']
    const currentData = this.state.data
    const originalData = this.props.thing
    const changedData = {}
    for (const field of FIELDS) {
      const currentField = currentData[field] ? currentData[field] : null
      // Nullable/undefined field === empty string in editor
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
    // TODO: verify data
    if (this.props.mode === THINGDIALOG_EDIT) {
      const changedData = this.getChangedData()
      if (Object.keys(changedData).length > 0) {
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

  handleDelete = () => {
    // Do not confirm, if a mistake is made it can be retrieved from the trash
    this.props.dispatch(api.deleteThing(this.props.thing.id))
    this.props.closeDialog()
  }

  handleCancel = () => {
    if (Object.keys(this.getChangedData()).length > 0) {
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
    const confirmDialog = this.state.confirm.open
      ? <ConfirmDialog
          open={this.state.confirm.open}
          title={this.state.confirm.title}
          text={this.state.confirm.text}
          onYes={() => { this.state.confirm.handleYes() }}
          onNo={() => { this.state.confirm.handleNo() }} />
      : null
    const buttons = <div>
      { /* Hide delete button on new things */
        this.props.mode !== THINGDIALOG_NEW
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

    return (
      <Dialog
        title={this.props.mode === THINGDIALOG_EDIT ? thing.name : i18next.t('thing.newTitle')}
        actions={buttons}
        open={this.props.mode !== THINGDIALOG_CLOSED}
        onRequestClose={this.handleCancel}
      >
        <TextField name='name'
          floatingLabelText={i18next.t('thing.name')}
          defaultValue={thing.name}
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
      </Dialog>
    )
  }
}
