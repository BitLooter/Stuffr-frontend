import React from 'react'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import yup from 'yup'
import log from 'loglevel'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import { registerUser } from '../actions'
import t from '../i18n'

// Adds an 'equalTo' test to validations that compares value to another field.
// Move this into the startup function if I build another form using it
function equalTo (fieldName, message) {
  return yup.mixed().test('equalTo', message, function (value) {
    return value === this.parent[fieldName]
  })
}
yup.addMethod(yup.mixed, 'equalTo', equalTo)

const reduxWrapper = connect(
  function mapStateToProps (state) {
    return {
      errorMessage: state.ui.registerDialogError
    }
  },
  {registerUser})
const formikWrapper = Formik({
  mapPropsToValues: (props) => ({
    email: '',
    password: '',
    password_confirm: '',
    name_first: '',
    name_last: ''
  }),
  validationSchema: yup.object().shape({
    email: yup.string().email().required(t('register.emailErrorMissing')),
    password: yup.string().required(t('register.passwordErrorMissing')),
    password_confirm: yup.string()
      .equalTo('password', t('register.passwordErrorMismatch'))
      .required(t('register.passwordConfirmErrorMissing')),
    name_first: yup.string().required(t('register.nameFirstErrorMissing')),
    name_last: yup.string().required(t('register.nameLastErrorMissing'))
  }),
  handleSubmit: (values, {props}) => {
    // TODO: Authentication manager should switch back to login view after register
    log.info(`Register request for ${values.email}`)
    props.registerUser(values)
  }
})
export default reduxWrapper(formikWrapper(({
  handleSwitchToLogin,
  errorMessage,
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
      label={t('auth.registerSubmit')}
      onClick={handleSubmit}/>
  </div>

  return <Dialog
    open={true}
    title={t('auth.registerTitle')}
    actions={dialogButtons}
  >
    {errorMessage ? <div>{errorMessage}</div> : null}
    <TextField name='email' onChange={handleChange}
      floatingLabelText={t('auth.email')}
      errorText={errors.email} /> <br />
    <TextField name='password' onChange={handleChange}
      floatingLabelText={t('auth.password')} type='password'
      errorText={errors.password} /> <br />
    {/* TODO: check passwords on blur */}
    <TextField name='password_confirm' onChange={handleChange}
      floatingLabelText={t('auth.passwordConfirm')} type='password'
      errorText={errors.password_confirm} /> <br />
    <TextField name='name_first' onChange={handleChange}
      floatingLabelText={t('auth.nameFirst')}
      errorText={errors.name_first} />
    <TextField name='name_last' onChange={handleChange}
      floatingLabelText={t('auth.nameLast')}
      errorText={errors.name_last} /> <br />
  </Dialog>
}))
