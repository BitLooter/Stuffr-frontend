import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withFormik } from 'formik'
import yup from 'yup'
import log from 'loglevel'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import { loginUser } from '../actions/auth'
import t from '../i18n'

// TODO: Prevent making a request to userinfo on login error (e.g. bad password)

// TODO: Clear loginError after successful login
const reduxWrapper = connect(
  function mapStateToProps (state) {
    return {
      errorMessage: state.auth.loginError
    }
  })
const formikWrapper = withFormik({
  mapPropsToValues: (props) => ({
    email: '',
    password: ''
  }),
  validationSchema: yup.object().shape({
    email: yup.string().required(t('auth.emailErrorMissing')),
    password: yup.string().required(t('auth.passwordErrorMissing'))
  }),
  handleSubmit: async (values, {props}) => {
    log.info(`Login request for ${values.email}`)
    // TODO: Handle backend login errors
    await props.dispatch(loginUser(values.email, values.password))
    props.onLogin(props.dispatch)
  }
})
const LoginDialog = reduxWrapper(formikWrapper(({
  handleSwitchToRegister, handleSwitchToPWReset,
  errorMessage,
  values, errors,
  handleChange, handleSubmit
}) => {
  const dialogButtons = <div>
    <RaisedButton
      secondary={true}
      label={t('auth.switchToRegister')}
      onClick={handleSwitchToRegister}/>
    <RaisedButton
      primary={true}
      label={t('auth.loginSubmit')}
      onClick={handleSubmit}/>
  </div>

  return <Dialog
    open={true}
    title={t('auth.loginTitle')}
    actions={dialogButtons}
  >
    {errorMessage ? <div>{errorMessage}</div> : null}
    <TextField name='email' onChange={handleChange}
      floatingLabelText={t('auth.email')}
      errorText={errors.email} /> <br />
    <TextField name='password' onChange={handleChange}
      floatingLabelText={t('auth.password')} type='password'
      errorText={errors.password} /> <br /><br />
    <a onClick={handleSwitchToPWReset}>{t('auth.switchToPWReset')}</a>
  </Dialog>
}))
LoginDialog.propTypes = {
  onLogin: PropTypes.func.isRequired
}

export default LoginDialog
