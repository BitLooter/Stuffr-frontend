import React from 'react'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import yup from 'yup'
import log from 'loglevel'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import { loginUser } from '../actions'
import t from '../i18n'

const reduxWrapper = connect(
  function mapStateToProps (state) {
    return {
      errorMessage: state.ui.loginDialogError
    }
  },
  { loginUser })
const formikWrapper = Formik({
  mapPropsToValues: (props) => ({
    email: '',
    password: ''
  }),
  validationSchema: yup.object().shape({
    email: yup.string().required(t('auth.emailErrorMissing')),
    password: yup.string().required(t('auth.passwordErrorMissing'))
  }),
  handleSubmit: (values, {props}) => {
    log.info(`Login request for ${values.email}`)
    props.loginUser(values.email, values.password)
  }
})
export default reduxWrapper(formikWrapper(({
  handleSwitchToRegister,
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
      errorText={errors.password} /> <br />
  </Dialog>
}))
