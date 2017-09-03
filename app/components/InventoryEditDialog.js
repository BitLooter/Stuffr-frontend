import React from 'react'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import yup from 'yup'
import log from 'loglevel'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import moment from 'moment'

import { submitInventory, closeInventoryEditor } from '../actions'
import t from '../i18n'

const DIALOG_NEW = Symbol.for('ui.DIALOG_NEW')
const DIALOG_EDIT = Symbol.for('ui.DIALOG_EDIT')

const formikWrapper = Formik({
  mapPropsToValues: (props) => ({
    name: ''
  }),
  validationSchema: yup.object().shape({
    name: yup.string().required(t('inventory.nameErrorMissing'))
  }),
  handleSubmit: (values, {props}) => {
    if (props.mode === DIALOG_EDIT) {
      // TODO: only submit changed fields
      log.info(`Updating existing inventory with id ${props.inventory.id}`)
      props.submitInventory(values, props.inventory.id)
    } else if (props.mode === DIALOG_NEW) {
      log.info(`Creating new inventory named ${values.name}`)
      props.submitInventory(values)
    } else {
      const errorMessage = `Unknown mode for InventoryEditDialog: ${String(props.mode)}`
      log.error(errorMessage)
      throw new Error(errorMessage)
    }
    // TODO: some sort of loading animation while waiting on the HTTP request
  }
})
const reduxWrapper = connect(undefined, {submitInventory, closeInventoryEditor})
export default reduxWrapper(formikWrapper(({
  inventory, mode,
  closeInventoryEditor,
  errors,
  handleChange, handleSubmit
}) => {
  const buttons = <div>
    <FlatButton
      label={t('common.cancel')}
      onClick={closeInventoryEditor}
    />
    <RaisedButton
      primary={true}
      label={t('common.save')}
      onClick={handleSubmit}
    />
  </div>
  const title = mode === DIALOG_EDIT
    ? inventory.name : t('inventory.newTitle')

  return <Dialog
    open={true}
    title={title}
    actions={buttons}
    onRequestClose={closeInventoryEditor}
  >
    <TextField name='name'
      floatingLabelText={t('inventory.name')}
      defaultValue={inventory.name}
      errorText={errors.name}
      onChange={handleChange}
    />
    {mode !== DIALOG_EDIT ? null : (<div><br />
      Date added: {moment(inventory.date_created).calendar()}
    </div>)}
  </Dialog>
}))
