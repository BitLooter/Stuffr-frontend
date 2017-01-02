import React from 'react'
import {connect} from 'react-redux'
import log from 'loglevel'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import moment from 'moment'

import {postThing, updateThing, deleteThing, editThingDone} from '../actions'

const THINGDIALOG_NEW = Symbol.for('ui.THINGDIALOG_NEW')
const THINGDIALOG_EDIT = Symbol.for('ui.THINGDIALOG_EDIT')
const THINGDIALOG_CLOSED = Symbol.for('ui.THINGDIALOG_CLOSED')
const MULTILINE_ROWS = 5

@connect(
  (state) => {
    return {
      currentInventoryId: state.database.inventories.length > 0 ? state.database.inventories[0].id : null
    }
  }
)
export default class ThingEditDialog extends React.Component {
  static proptypes = { dispatch: React.PropTypes.func.isRequired }

  close = () => {
    this.props.dispatch(editThingDone())
  }

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
      this.props.dispatch(updateThing(this.props.thing.id, updateData))
    } else if (this.props.mode === THINGDIALOG_NEW) {
      const newData = this.getThingData()
      log.info(`Creating new thing named ${newData.name}`)
      this.props.dispatch(postThing(this.props.currentInventoryId, newData))
    } else {
      const errorMessage = `Unknown mode for ThingEditDialog: ${String(this.props.mode)}`
      log.error(errorMessage)
      throw new Error(errorMessage)
    }
    this.close()
  }

  handleDelete = () => {
    // TODO: Confirm deletion with user
    this.props.dispatch(deleteThing(this.props.thing.id))
    this.close()
  }

  handleCancel = () => {
    // TODO: Confirm cancel if data changed
    this.close()
  }

  render () {
    const thing = this.props.thing
    // TODO: Hide delete button if mode is NEW
    const buttons = [
      <div>
        <FlatButton
          style={{float: 'left'}}
          label='Delete'
          onClick={this.handleDelete}
        />
        <FlatButton
          label='Cancel'
          onClick={this.handleCancel}
        />
        <RaisedButton
          primary={true}
          label='Save'
          onClick={this.handleDone}
        />
      </div>
    ]
    return (
      <Dialog
        title={this.props.mode === THINGDIALOG_EDIT ? thing.name : 'New thing'}
        actions={buttons}
        open={this.props.mode !== THINGDIALOG_CLOSED}
        onRequestClose={this.handleCancel}
      >
        <TextField name='thingName' ref='thingName'
          floatingLabelText='Name'
          defaultValue={thing.name} /><br />
        <TextField name='thingDesc' ref='thingDesc'
          floatingLabelText='Description'
          multiLine={true}
          rows={MULTILINE_ROWS} rowsMax={MULTILINE_ROWS}
          fullWidth={true}
          defaultValue={thing.description} /><br />
        <TextField name='thingNotes' ref='thingNotes'
          floatingLabelText='Notes'
          multiLine={true}
          rows={MULTILINE_ROWS} rowsMax={MULTILINE_ROWS}
          fullWidth={true}
          defaultValue={thing.notes} /><br />
        {this.props.mode !== THINGDIALOG_EDIT ? null : (<div>
          Date added: {moment(thing.date_created).calendar()}<br />
          Last updated: {moment(thing.date_modified).calendar()}
        </div>)}
      </Dialog>
    )
  }
}
