// React component to display a dialog for editing a thing.

// Disable proptype linting, ESLint gets confused by
// react-redux and Formik injected props on classes
/* eslint-disable react/prop-types */

import React from 'react'
import { connect } from 'react-redux'
import { withFormik } from 'formik'
import yup from 'yup'
import log from 'loglevel'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import moment from 'moment'

import { closeThingEditor, submitThing, removeThing } from '../actions'
import t from '../../common/i18n'
import { withConfirmDialog } from './ConfirmDialog'

const DIALOG_NEW = Symbol.for('ui.DIALOG_NEW')
const DIALOG_EDIT = Symbol.for('ui.DIALOG_EDIT')
const MULTILINE_ROWS = 3

const reduxWrapper = connect(
  function mapStateToProps (state) {
    return {
      // TODO: Throw error if current inventory does not exist
      currentInventoryId: state.database.inventories.length > 0
        ? state.database.inventories[state.ui.currentInventory].id
        : null
    }
  },
  {submitThing, removeThing, closeThingEditor}
)
const formikWrapper = withFormik({
  mapPropsToValues: ({thing}) => ({
    name: thing.name, details: thing.details, location: thing.location}
  ),
  validationSchema: yup.object().shape({
    name: yup.string().required(t('thing.nameErrorMissing')),
    details: yup.string().nullable(),
    location: yup.string().nullable()
  }),
  handleSubmit: (values, {props}) => {
    if (props.mode === DIALOG_EDIT) {
      // TODO: Check for changes and submit only modified fields
      log.info(`Updating existing thing with id ${props.thing.id}`)
      props.submitThing(values, null, props.thing.id)
    } else if (props.mode === DIALOG_NEW) {
      log.info(`Creating new thing named ${values.name}`)
      props.submitThing(values, props.currentInventoryId)
    } else {
      const errorMessage = `Unknown mode for ThingEditDialog: ${String(props.mode)}`
      log.error(errorMessage)
      throw new Error(errorMessage)
    }
    // TODO: some sort of loading animation while waiting on the HTTP request
  }
})

const ThingEditDialog = withConfirmDialog(reduxWrapper(formikWrapper(({
  thing, mode,
  values, errors, dirty, handleChange, handleSubmit,
  closeThingEditor, removeThing,
  confirmWithUser
}) => {
  async function confirmCancel () {
    // TODO: Figure out why dirty doesn't work
    if (dirty) {
      const discardChanges = await confirmWithUser(
        t('thing.confirmCancelTitle'),
        t('thing.confirmCancelText')
      )
      if (discardChanges) {
        closeThingEditor()
      }
    } else {
      closeThingEditor()
    }
  }

  function handleDelete () {
    // Do not confirm, if a mistake is made user can retrieve it from the trash
    removeThing(thing.id)
    closeThingEditor()
  }

  const title = mode === DIALOG_EDIT ? thing.name : t('thing.newTitle')
  const buttons = <div>
    { /* Hide delete button on new things */
      mode !== DIALOG_NEW
        ? <FlatButton
          style={{float: 'left'}}
          label={t('thing.delete')}
          onClick={handleDelete} />
        : null
    }
    <FlatButton
      label={t('common.cancel')}
      onClick={confirmCancel}
    />
    { /* TODO: Disable button if nothing has been edited */ }
    <RaisedButton
      primary={true}
      label={t('common.save')}
      onClick={handleSubmit}
    />
  </div>

  return <Dialog
    open={true}
    title={title}
    actions={buttons}
    onRequestClose={confirmCancel}
  >
    <TextField name='name'
      floatingLabelText={t('thing.name')}
      defaultValue={values.name}
      errorText={errors.name}
      onChange={handleChange} /><br />
    <TextField name='details'
      floatingLabelText={t('thing.details')}
      defaultValue={values.details}
      multiLine={true}
      rows={MULTILINE_ROWS} rowsMax={MULTILINE_ROWS}
      fullWidth={true}
      onChange={handleChange} />
    {mode !== DIALOG_EDIT ? null : (<div><br />
      {t('thing.dateAdded')}: {moment(thing.date_created).calendar()}<br />
      {t('thing.dateModified')}: {moment(thing.date_modified).calendar()}
    </div>)}
  </Dialog>
})))

export default ThingEditDialog
