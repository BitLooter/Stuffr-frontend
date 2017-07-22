import React from 'react'
import PropTypes from 'prop-types'
import log from 'loglevel'
import Dialog from 'material-ui/Dialog'

/* Base class for all form-based dialogs.
When subclassing this to create dialogs, you must do the following:
- Define a static class property 'fields' with a array of field names for the automatic state
  updating. Form fields can then use the handleChange method with onChange/onBlur/etc. to track
  state. You may need to define your own change handler for non-trivial fields.
- Call super() in the constructor with props and the default form state.
*/
export default class FormDialogBase extends React.Component {
  static proptypes = { dispatch: PropTypes.func.isRequired }

  constructor (props, defaultData) {
    super(props)
    // Confirm fields defined
    if (!defaultData) {
      // TODO: raise or dispatch some sort of error here
      log.error('Default form data not provided')
    }
    if (!this.constructor.fields) {
      // TODO: raise or dispatch some sort of error here
      log.error('Fields not defined')
    }

    // Make a shallow copy of defaultData to prevent shenanigans
    this.originalData = {...defaultData}
    this.state = { data: defaultData, errors: {} }
  }

  getChangedData = () => {
    const currentData = this.state.data
    const changedData = {}
    for (const field of this.constructor.fields) {
      // Nullable/undefined field === empty string in editor
      const currentField = currentData[field] ? currentData[field] : null
      const originalField = this.originalData[field] ? this.originalData[field] : null
      if (currentField !== originalField) {
        changedData[field] = currentField
      }
    }
    return changedData
  }

  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    const newData = {[name]: value}
    this.setState({data: {...this.state.data, ...newData}})
  }

  renderDialog (title, buttons, form, onRequestClose) {
    return (
      <Dialog
        open={true}
        title={title}
        actions={buttons}
        onRequestClose={onRequestClose}
      >
        {form}
      </Dialog>
    )
  }
}
