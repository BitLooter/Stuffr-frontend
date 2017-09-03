// React component to display a dialog for editing a thing.

// Disable proptype linting, ESLint gets confused by
// react-redux and Formik injected props on classes
/* eslint-disable react/prop-types */

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

import { closeThingEditor, submitThing, removeThing } from '../actions'
import t from '../i18n'
import ConfirmDialog from './ConfirmDialog'

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
const formikWrapper = Formik({
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
@reduxWrapper
@formikWrapper
export default class ThingEditDialog extends React.Component {
  constructor (props) {
    super(props)
    // TODO: The confirm dialog is the only reason to use a stateful class
    // component rather than a stateless funcional component. Consider using
    // a higher-level generic component (possibly not specific to dialogs)
    // that passes handleConfirm() as a prop and converting this one to a
    // stateless component.
    this.state = {confirm: {
      open: false,
      title: 'NO TITLE',
      text: 'Confirm placeholder',
      onYes: () => null,
      onNo: () => null
    }}
  }

  handleDelete = () => {
    // Do not confirm, if a mistake is made user can retrieve it from the trash
    this.props.removeThing(this.props.thing.id)
    this.props.closeThingEditor()
  }

  handleCancel = () => {
    // Show confirmation dialog if form data has changed
    // TODO: Figure out why dirty isn't working
    if (this.props.dirty) {
      this.setState({confirm: {
        open: true,
        title: t('thing.confirmCancelTitle'),
        text: t('thing.confirmCancelText'),
        handleYes: this.props.closeThingEditor,
        handleNo: () => this.setState({confirm: {open: false}})
      }})
    } else {
      this.props.closeThingEditor()
    }
  }

  render () {
    log.info(this.props.values)
    log.info(this.props.errors)
    const values = this.props.values
    const thing = this.props.thing
    const title = this.props.mode === DIALOG_EDIT ? thing.name : t('thing.newTitle')
    const confirmDialog = this.state.confirm.open
      ? <ConfirmDialog
        open={this.state.confirm.open}
        title={this.state.confirm.title}
        text={this.state.confirm.text}
        onYes={() => { this.state.confirm.handleYes() }}
        onNo={() => { this.state.confirm.handleNo() }} />
      : null
    const buttons = <div>
      { /* Hide delete button on new things */
        this.props.mode !== DIALOG_NEW
          ? <FlatButton
            style={{float: 'left'}}
            label={t('thing.delete')}
            onClick={this.handleDelete} />
          : null
      }
      <FlatButton
        label={t('common.cancel')}
        onClick={this.handleCancel}
      />
      { /* TODO: Disable button if nothing has been edited */ }
      <RaisedButton
        primary={true}
        label={t('common.save')}
        onClick={this.props.handleSubmit}
      />
    </div>

    return <Dialog
      open={true}
      title={title}
      actions={buttons}
      onRequestClose={this.handleCancel}
    >
      <TextField name='name'
        floatingLabelText={t('thing.name')}
        defaultValue={values.name}
        errorText={this.props.errors.name}
        onChange={this.props.handleChange} /><br />
      <TextField name='details'
        floatingLabelText={t('thing.details')}
        defaultValue={values.details}
        multiLine={true}
        rows={MULTILINE_ROWS} rowsMax={MULTILINE_ROWS}
        fullWidth={true}
        onChange={this.props.handleChange} />
      {this.props.mode !== DIALOG_EDIT ? null : (<div><br />
        {t('thing.dateAdded')}: {moment(thing.date_created).calendar()}<br />
        {t('thing.dateModified')}: {moment(thing.date_modified).calendar()}
      </div>)}
      {confirmDialog}
    </Dialog>
  }
}
