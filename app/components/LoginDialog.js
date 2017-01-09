import React from 'react'
import {connect} from 'react-redux'
import log from 'loglevel'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import {loginUser, registerUser} from '../actions'

@connect(
  function mapStateToProps (state) {
    return {
      authenticated: state.ui.authorized
    }
  }
)
export default class LoginDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: 'Login',
      form: this.loginForm,
      buttons: this.loginButtons
    }
  }

  // Event handlers
  handleSwitchToRegister = () => {
    // TODO: forms retain data on switch, fix that
    this.setState({
      title: 'Register',
      form: this.registerForm,
      buttons: this.registerButtons
    })
  }

  handleSwitchToLogin = () => {
    this.setState({
      title: 'Login',
      form: this.loginForm,
      buttons: this.loginButtons
    })
  }

  handleLogin = () => {
    // TODO: verify data
    const loginInfo = this.getLoginInfo()
    log.info(`Login request for ${loginInfo.email}`)
    this.props.dispatch(loginUser(loginInfo.email, loginInfo.password))
  }

  handleRegister = () => {
    // TODO: verify data
    // TODO: confirm password
    const registerInfo = this.getRegisterInfo()
    log.info(`Register request for ${registerInfo.email}`)
    this.props.dispatch(registerUser(registerInfo))
  }

  // Forms
  loginForm = <div>
    <TextField name='email' ref='email'
      floatingLabelText='Email' /> <br />
    <TextField name='password' ref='password'
      floatingLabelText='Password' type='password' /> <br />
    <RaisedButton
      primary={true}
      label='Login'
      fullWidth={true}
      onClick={this.handleLogin}
    />
  </div>

  loginButtons = [
    <RaisedButton
      primary={true}
      label='Register new user'
      fullWidth={true}
      onClick={this.handleSwitchToRegister}
    />
  ]

  registerForm = <div>
    <TextField name='email' ref='email'
      floatingLabelText='Email' /> <br />
    <TextField name='password' ref='password'
      floatingLabelText='Password' type='password' /> <br />
    <TextField name='password_confirm' ref='password_verify'
      floatingLabelText='Password again' type='password' /> <br />
    <TextField name='name_first' ref='name_first'
      floatingLabelText='First name' />
    <TextField name='name_last' ref='name_last'
      floatingLabelText='Last name' /> <br />
    <RaisedButton
      primary={true}
      label='Register'
      fullWidth={true}
      onClick={this.handleRegister}
    />
  </div>

  registerButtons = [
    <RaisedButton
      primary={true}
      label='Back to login'
      fullWidth={true}
      onClick={this.handleSwitchToLogin}
    />
  ]

  // Utility methods
  getLoginInfo () {
    return {email: this.refs.email.getValue(),
            password: this.refs.password.getValue()}
  }

  getRegisterInfo () {
    return {email: this.refs.email.getValue(),
            password: this.refs.password.getValue(),
            name_last: this.refs.name_last.getValue(),
            name_first: this.refs.name_first.getValue()}
  }

  // TODO: Show an error if wrong credentials are used
  // TODO: Password reset button
  render () {
    return (
      <Dialog
        title={this.state.title}
        actions={this.state.buttons}
        open={!this.props.authenticated}
      >
        {this.state.form}
      </Dialog>
    )
  }
}
