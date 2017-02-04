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

const THINGDIALOG_NEW = Symbol.for('ui.THINGDIALOG_NEW')
const THINGDIALOG_EDIT = Symbol.for('ui.THINGDIALOG_EDIT')
const THINGDIALOG_CLOSED = Symbol.for('ui.THINGDIALOG_CLOSED')
const MULTILINE_ROWS = 5

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
  getThingData = () => {
    return {
      name: this.refs.thingName.getValue(),
      description: this.refs.thingDesc.getValue(),
      notes: this.refs.thingNotes.getValue()
    }
  }

  handleDone = () => {
    // TODO: check that data changed before submitting
    // TODO: verify data
    if (this.props.mode === THINGDIALOG_EDIT) {
      const updateData = this.getThingData()
      log.info(`Updating existing thing named ${updateData.name}`)
      this.props.updateThing(this.props.thing.id, updateData)
    } else if (this.props.mode === THINGDIALOG_NEW) {
      const newData = this.getThingData()
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
    // TODO: Confirm deletion with user
    this.props.dispatch(api.deleteThing(this.props.thing.id))
    this.props.closeDialog()
  }

  handleCancel = () => {
    // TODO: Confirm cancel if data changed
    this.props.closeDialog()
  }

  render () {
    const thing = this.props.thing
    // TODO: Hide delete button if mode is NEW
    const buttons = [
      <div>
        <FlatButton
          style={{float: 'left'}}
          label={i18next.t('thing.delete')}
          onClick={this.handleDelete}
        />
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
        title={this.props.mode === THINGDIALOG_EDIT ? thing.name : i18next.t('thing.newTitle')}
        actions={buttons}
        open={this.props.mode !== THINGDIALOG_CLOSED}
        onRequestClose={this.handleCancel}
      >
        <TextField name='thingName' ref='thingName'
          floatingLabelText={i18next.t('thing.name')}
          defaultValue={thing.name} /><br />
        <TextField name='thingDesc' ref='thingDesc'
          floatingLabelText={i18next.t('thing.description')}
          multiLine={true}
          rows={MULTILINE_ROWS} rowsMax={MULTILINE_ROWS}
          fullWidth={true}
          defaultValue={thing.description} /><br />
        <TextField name='thingNotes' ref='thingNotes'
          floatingLabelText={i18next.t('thing.notes')}
          multiLine={true}
          rows={MULTILINE_ROWS} rowsMax={MULTILINE_ROWS}
          fullWidth={true}
          defaultValue={thing.notes} /><br />
        {this.props.mode !== THINGDIALOG_EDIT ? null : (<div>
          {i18next.t('thing.dateAdded')}: {moment(thing.date_created).calendar()}<br />
          {i18next.t('thing.dateModified')}: {moment(thing.date_modified).calendar()}
        </div>)}
      </Dialog>
    )
  }
}
