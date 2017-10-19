import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'

import t from '../../common/i18n'

const ConfirmDialog = ({open = true, title, text, onYes, onNo}) =>
  <Dialog
    title={title}
    actions={ <div>
      <RaisedButton secondary={true} label={t('common.no')} onClick={onNo} />
      <RaisedButton primary={true} label={t('common.yes')} onClick={onYes} /> </div> }
    open={open}
    modal={true}
  >
    {text}
  </Dialog>
ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onYes: PropTypes.func.isrequired,
  onNo: PropTypes.func.isrequired
}

export default ConfirmDialog

// React HOC that wraps a given component and adds 'confirmWithUser' to its
// props. When called as a function it displays a confirmation dialog to the
// user and returns a promise that resolves to true or false, depending on
// whether the user selects Yes or No. confirmWithUser takes two arguments,
// the title and the text of the confirm dialog.
export function withConfirmDialog (WrappedComponent) {
  return class ConfirmDialogProvider extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        open: false,
        // TODO: Better defaults, using t()
        title: 'NO TITLE',
        text: 'Confirm placeholder',
        handleYes: () => null,
        handleNo: () => null
      }
    }

    showConfirm = (title, text) => {
      return new Promise((resolve, reject) => {
        const hideAndResolve = (result) => {
          this.hideConfirm()
          resolve(result)
        }
        this.setState({
          open: true,
          title,
          text,
          handleYes: () => { hideAndResolve(true) },
          handleNo: () => { hideAndResolve(false) }
        })
      })
    }

    hideConfirm = () => {
      this.setState({open: false})
    }

    render () {
      return <div>
        <WrappedComponent
          confirmWithUser={this.showConfirm}
          {...this.props}
        />
        <ConfirmDialog
          open={this.state.open}
          title={this.state.title}
          text={this.state.text}
          onYes={this.state.handleYes}
          onNo={this.state.handleNo}
        />
      </div>
    }
  }
}
