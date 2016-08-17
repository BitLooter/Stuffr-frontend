import React from 'react'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import ui from 'redux-ui'

export default class ThingEditDialog extends React.Component {
  static proptypes = { dispatch: React.PropTypes.func.isRequired }

  handleClose = () => {
    this.props.updateUI('thingDialog', {...this.props.ui.thingDialog, open: false})
  }

  render () {
    const ui = this.props.ui.thingDialog
    const buttons = [
      <FlatButton
        label='Done'
        onClick={this.handleClose}
      />
    ]
    return (
      <Dialog
        title='Thing editor'
        actions={buttons}
        open={ui.open}
        onRequestClose={this.handleClose}
      >
        {ui.thing.name}
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
