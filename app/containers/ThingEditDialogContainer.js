import React from 'react'
import {connect} from 'react-redux'
import log from 'loglevel'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import {postThing, updateThing, editThingDone} from '../actions'

@connect(
  (state) => {
    return {
      mode: state.ui.getIn(['thingDialog', 'mode']),
      thing: state.ui.getIn(['thingDialog', 'thing']).toJS()
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
    if (this.props.mode === Symbol.for('ui.THINGDIALOG_EDIT')) {
      const updateData = {name: this.refs.thingName.getValue()}
      log.info(`Updating existing thing named ${updateData.name}`)
      this.props.dispatch(updateThing(this.props.thing.id, updateData))
    } else if (this.props.mode === Symbol.for('ui.THINGDIALOG_NEW')) {
      const newData = {name: this.refs.thingName.getValue()}
      log.info(`Creating new thing named ${newData.name}`)
      this.props.dispatch(postThing(newData))
    } // TODO: Error for unknown modes
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
        title={thing.name}
        actions={buttons}
        open={this.props.mode !== Symbol.for('ui.THINGDIALOG_CLOSED')}
        onRequestClose={this.handleCancel}
      >
        Name: <TextField name='thingName' ref='thingName'
          defaultValue={thing.name} /><br />
        Date added: {thing.date_created}
      </Dialog>
    )
  }
}
