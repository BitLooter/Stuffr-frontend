import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'

import t from '../i18n'

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
