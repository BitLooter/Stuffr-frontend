import React from 'react'
import { connect } from 'react-redux'
import log from 'loglevel'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import { loginUser } from '../actions'
import t from '../i18n'
import { isString, isEmpty } from '../util'
import FormDialogBase from './FormDialogBase'

@connect(
  function mapStateToProps (state) {
    return {
      errorMessage: state.ui.loginDialogError
    }
  },
  { loginUser }
)
export default class LoginDialog extends FormDialogBase {
  constructor (props) {
    super(props, {
      email: '',
      password: ''
    })
    this.buttons = <RaisedButton
      primary={true}
      label={t('auth.switchToRegister')}
      fullWidth={true}
      onTouchTap={this.props.onSwitchToRegister}
    />
  }

  validateForm = () => {
    const data = this.state.data
    const errors = {}

    // Email
    if (isString(data.email)) {
      if (data.email.length === 0) {
        errors.email = t('login.emailErrorMissing')
      }
    } else {
      log.error(`Email should be a string, found ${typeof data.email} instead`)
    }
    // Password
    if (isString(data.password)) {
      if (data.password.length === 0) {
        errors.password = t('login.passwordErrorMissing')
      }
    } else {
      log.error(`Password should be a string, found ${typeof data.password} instead`)
    }

    this.setState({errors})
    return isEmpty(errors)
  }

  handleSubmit = () => {
    if (this.validateForm()) {
      log.info(`Login request for ${this.state.email}`)
      this.props.loginUser(this.state.data.email, this.state.data.password)
    }
  }

  // TODO: Show an error if wrong credentials are used
  render () {
    const form = <div>
      {this.props.errorMessage ? <div>{this.props.errorMessage}</div> : null}
      <TextField name='email' onChange={this.handleChange}
        floatingLabelText={t('auth.email')}
        errorText={this.state.errors.email} /> <br />
      <TextField name='password' onChange={this.handleChange}
        floatingLabelText={t('auth.password')} type='password'
        errorText={this.state.errors.password} /> <br />
      <RaisedButton
        primary={true}
        label={t('auth.loginSubmit')}
        fullWidth={true}
        onTouchTap={this.handleSubmit}
      />
    </div>

    return this.renderDialog(t('auth.loginTitle'), this.buttons, form, () => {})
  }
}
