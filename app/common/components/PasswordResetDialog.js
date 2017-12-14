import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withFormik } from 'formik'
import yup from 'yup'
import log from 'loglevel'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import { resetPassword } from '../actions/auth'
import t from '../i18n'

// TODO: Clear loginError after successful login
// TODO: Display reset errors
const reduxWrapper = connect(
  // function mapStateToProps (state) {
  //   return {
  //     errorMessage: state.auth.loginError
  //   }
  // })
)
const formikWrapper = withFormik({
  mapPropsToValues: (props) => ({
    email: ''
  }),
  validationSchema: yup.object().shape({
    email: yup.string().required(t('auth.emailErrorMissing'))
  }),
  handleSubmit: async (values, {props}) => {
    log.info(`Password reset request for ${values.email}`)
    // TODO: Handle backend errors
    // TODO: Display further instructions on submit
    await props.dispatch(resetPassword(values.email))
  }
})
const PasswordResetDialog = reduxWrapper(formikWrapper(({
  handleSwitchToLogin,
  values, errors,
  handleChange, handleSubmit
}) => {
  const dialogButtons = <div>
    <RaisedButton
      secondary={true}
      label={t('auth.switchToLogin')}
      onClick={handleSwitchToLogin}/>
    <RaisedButton
      primary={true}
      label={t('auth.submitPWReset')}
      onClick={handleSubmit}/>
  </div>

  return <Dialog
    open={true}
    title={t('auth.loginTitle')}
    actions={dialogButtons}
  >
    <TextField name='email' onChange={handleChange}
      floatingLabelText={t('auth.email')}
      errorText={errors.email} /> <br />
  </Dialog>
}))
PasswordResetDialog.propTypes = {
  onLogin: PropTypes.func.isRequired
}

export default PasswordResetDialog
