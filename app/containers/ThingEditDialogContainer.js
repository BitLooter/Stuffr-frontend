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

@connect(
  (state) => {
    return {
      mode: state.ui.thingDialog.mode,
      thing: state.ui.thingDialog.thing
    }
  }
)
export default class ThingEditDialog extends React.Component {
  static proptypes = { dispatch: React.PropTypes.func.isRequired }

  close = () => {
    this.props.dispatch(editThingDone())
  }

  handleDone = () => {
    // TODO: check that data changed before submitting
    // TODO: verify data
    if (this.props.mode === THINGDIALOG_EDIT) {
      const updateData = {name: this.refs.thingName.getValue()}
      log.info(`Updating existing thing named ${updateData.name}`)
      this.props.dispatch(updateThing(this.props.thing.id, updateData))
    } else if (this.props.mode === THINGDIALOG_NEW) {
      const newData = {name: this.refs.thingName.getValue()}
      log.info(`Creating new thing named ${newData.name}`)
      this.props.dispatch(postThing(newData))
    } // TODO: Error for unknown modes
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
        Name: <TextField name='thingName' ref='thingName'
          defaultValue={thing.name} /><br />
        {this.props.mode !== THINGDIALOG_EDIT ? '' : (<div>
          Date added: {moment(thing.date_created).calendar()}<br />
          Last updated: {moment(thing.date_modified).calendar()}
        </div>)}
      </Dialog>
    )
  }
}
