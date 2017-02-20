import React from 'react'
import i18next from 'i18next'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'

const ConfirmDialog = ({open = true, title, text, onYes, onNo}) =>
  <Dialog
    title={title}
    actions={ <div>
      <RaisedButton secondary={true} label={i18next.t('common.no')} onClick={onNo} />
      <RaisedButton primary={true} label={i18next.t('common.yes')} onClick={onYes} /> </div> }
    open={open}
    modal={true}
  >
    {text}
  </Dialog>
ConfirmDialog.propTypes = {
  open: React.PropTypes.bool,
  text: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  onYes: React.PropTypes.func.isrequired,
  onNo: React.PropTypes.func.isrequired
}

export default ConfirmDialog
