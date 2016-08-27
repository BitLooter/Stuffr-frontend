import React from 'react'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import ui from 'redux-ui'

import {createThingDialogState} from '../uistate'

export default class ThingEditDialog extends React.Component {
  static proptypes = { dispatch: React.PropTypes.func.isRequired }

  close = () => {
    this.props.updateUI('thingDialog', createThingDialogState(false))
  }

  handleDone = () => {
    this.close()
  }

  handleCancel = () => {
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
        Name: <TextField name='thingedit_name' defaultValue={thing.name} /><br />
        Date added: {thing.date_created}
      </Dialog>
    )
  }
}
ThingEditDialog = ui()(ThingEditDialog)  // eslint-disable-line no-class-assign

const mapStateToProps = (state) => {
  return state
}

// TODO: Change this to a decorator once it's available in babel
const ThingEditDialogContainer = connect(
  mapStateToProps
)(ThingEditDialog)
export default ThingEditDialogContainer
