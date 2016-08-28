import React from 'react'
import {connect} from 'react-redux'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import ui from 'redux-ui'

import {updateThing} from '../actions'
import {hideThingEditDialog} from '../uistate'

@connect(
  (state) => { return {things: state.things.toJS()} }
)
@ui()
export default class ThingEditDialog extends React.Component {
  static proptypes = { dispatch: React.PropTypes.func.isRequired }

  close = () => {
    hideThingEditDialog()
  }

  handleDone = () => {
    // TODO: check that data changed before submitting
    // TODO: verify data
    const updateData = {name: this.refs.thingName.getValue()}
    this.props.dispatch(updateThing(this.props.ui.thingDialog.thing.id, updateData))
    this.close()
  }

  handleCancel = () => {
    // TODO: Confirm cancel if data changed
    this.close()
  }

  render () {
    const ui = this.props.ui.thingDialog
    const thing = ui.thing
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
        open={ui.open}
        onRequestClose={this.handleCancel}
      >
        Name: <TextField name='thingName' ref='thingName'
          defaultValue={thing.name} /><br />
        Date added: {thing.date_created}
      </Dialog>
    )
  }
}
