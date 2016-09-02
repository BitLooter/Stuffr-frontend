import React from 'react'
import {connect} from 'react-redux'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import {updateThing, editThingDone} from '../actions'

@connect(
  (state) => {
    return {
      open: state.ui.getIn(['thingDialog', 'mode']) === Symbol.for('ui.THINGDIALOG_EDIT'),
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
    const updateData = {name: this.refs.thingName.getValue()}
    this.props.dispatch(updateThing(this.props.thing.id, updateData))
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
        open={this.props.open}
        onRequestClose={this.handleCancel}
      >
        Name: <TextField name='thingName' ref='thingName'
          defaultValue={thing.name} /><br />
        Date added: {thing.date_created}
      </Dialog>
    )
  }
}
