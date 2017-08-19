import React from 'react'
import { connect } from 'react-redux'
import log from 'loglevel'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import { registerUser } from '../actions'
import t from '../i18n'
import { isString, isEmpty } from '../util'
import FormDialogBase from './FormDialogBase'

@connect(
  function mapStateToProps (state) {
    return {
      errorMessage: state.ui.registerDialogError
    }
  },
  {registerUser}
)
export default class RegisterDialog extends FormDialogBase {
  static fields = ['email', 'password', 'password_confirm', 'name_first', 'name_last']
  constructor (props) {
    super(props, {
      email: '',
      password: '',
      password_confirm: '',
      name_first: '',
      name_last: ''
    })

    this.buttons = <RaisedButton
      primary={true}
      label={t('auth.switchToLogin')}
      fullWidth={true}
      onClick={this.props.onSwitchToLogin}
    />
  }

  validateForm = () => {
    const data = this.state.data
    const errors = {}

    // Email
    if (isString(data.email)) {
      // TODO: Validate email
      if (data.email.length === 0) {
        // TODO: Fix errors when this form is redone
        errors.email = t('register.emailErrorMissing')
      }
    } else {
      log.error(`Email should be a string, found ${typeof data.email} instead`)
    }
    // Password
    if (isString(data.password)) {
      // TODO: Validate against password requirements
      if (data.password.length === 0) {
        errors.password = t('register.passwordErrorMissing')
      }
    } else {
      log.error(`Password should be a string, found ${typeof data.password} instead`)
    }
    // Password confirm
    if (isString(data.password_confirm)) {
      if (data.password_confirm.length === 0) {
        errors.password_confirm = t('register.passwordConfirmErrorMissing')
      }
    } else {
      log.error(`Password confirm should be a string, found ${typeof data.password_confirm} instead`)
    }
    // First name
    if (isString(data.name_first)) {
      if (data.name_first.length === 0) {
        errors.name_first = t('register.nameFirstErrorMissing')
      }
    } else {
      log.error(`First name should be a string, found ${typeof data.name_first} instead`)
    }
    // Last name
    if (isString(data.name_last)) {
      if (data.name_last.length === 0) {
        errors.name_last = t('register.nameLastErrorMissing')
      }
    } else {
      log.error(`Last name should be a string, found ${typeof data.name_last} instead`)
    }

    this.setState({errors})
    return isEmpty(errors)
  }

  handleSubmit = () => {
    // TODO: Authentication manager should switch back to login view after register
    if (this.validateForm()) {
      log.info(`Register request for ${this.state.data.email}`)
      this.props.registerUser(this.state.data)
    }
  }

  render () {
    const form = <div>
      {this.props.errorMessage ? <div>{this.props.errorMessage}</div> : null}
      <TextField name='email' onBlur={this.handleChange}
        floatingLabelText={t('auth.email')}
        errorText={this.state.errors.email} /> <br />
      <TextField name='password' onBlur={this.handleChange}
        floatingLabelText={t('auth.password')} type='password'
        errorText={this.state.errors.password} /> <br />
      {/* TODO: check passwords with onChange to report status without blur */}
      <TextField name='password_confirm' onBlur={this.handleChange}
        floatingLabelText={t('auth.passwordConfirm')} type='password'
        errorText={this.state.errors.password_confirm} /> <br />
      <TextField name='name_first' onBlur={this.handleChange}
        floatingLabelText={t('auth.nameFirst')}
        errorText={this.state.errors.name_first} />
      <TextField name='name_last' onBlur={this.handleChange}
        floatingLabelText={t('auth.nameLast')}
        errorText={this.state.errors.name_last} /> <br />
      <RaisedButton
        primary={true}
        label={t('auth.registerSubmit')}
        fullWidth={true}
        onClick={this.handleSubmit}
      />
    </div>
    return this.renderDialog(t('auth.registerTitle'), this.buttons, form, () => {})
  }
}
