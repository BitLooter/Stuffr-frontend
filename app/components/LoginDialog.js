import React from 'react'
import {connect} from 'react-redux'
import log from 'loglevel'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import {loginUser, registerUser} from '../actions'

const MODE_LOGIN = Symbol()
const MODE_REGISTER = Symbol()

const LoginForm = ({values, onChange, onSubmit}) => <div>
  <TextField name='email' onChange={onChange}
    floatingLabelText='Email' /> <br />
  <TextField name='password' onChange={onChange}
    floatingLabelText='Password' type='password' /> <br />
  <RaisedButton
    primary={true}
    label='Login'
    fullWidth={true}
    onClick={onSubmit}
  />
</div>

const RegisterForm = ({values, onChange, onSubmit}) => <div>
  <TextField name='email' onChange={onChange}
    floatingLabelText='Email' /> <br />
  <TextField name='password' onChange={onChange}
    floatingLabelText='Password' type='password' /> <br />
  <TextField name='password_confirm' onChange={onChange}
    floatingLabelText='Password again' type='password' /> <br />
  <TextField name='name_first' onChange={onChange}
    floatingLabelText='First name' />
  <TextField name='name_last' onChange={onChange}
    floatingLabelText='Last name' /> <br />
  <RaisedButton
    primary={true}
    label='Register'
    fullWidth={true}
    onClick={onSubmit}
  />
</div>

@connect(
  function mapStateToProps (state) {
    return {
      authenticated: state.ui.authorized
    }
  },
  function mapDispatchToProps (dispatch) {
    return {
      login: (email, password) => { dispatch(loginUser(email, password)) },
      register: (registerInfo) => { dispatch(registerUser(registerInfo)) }
    }
  }
)
export default class LoginDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mode: MODE_LOGIN,
      login: {
        email: '',
        password: ''
      },
      register: {
        email: '',
        password: '',
        password_confirm: '',
        name_first: '',
        name_last: ''
      }
    }
  }

  // Event handlers
  handleSwitchToRegister = () => {
    // TODO: forms retain data on switch, fix that
    this.setState({
      title: 'Register',
      mode: MODE_REGISTER,
      buttons: this.registerButtons
    })
  }

  handleSwitchToLogin = () => {
    this.setState({
      title: 'Login',
      mode: MODE_LOGIN,
      buttons: this.loginButtons
    })
  }

  handleChangeLogin = (e) => {
    const newData = {[e.target.name]: e.target.value}
    this.setState({login: {...this.state.login, ...newData}})
  }

  handleSubmitLogin = () => {
    // TODO: verify data
    const loginInfo = this.state.login
    log.info(`Login request for ${loginInfo.email}`)
    this.props.login(loginInfo.email, loginInfo.password)
  }

  handleChangeRegister = (e) => {
    const newData = {[e.target.name]: e.target.value}
    this.setState({register: {...this.state.register, ...newData}})
  }

  handleSubmitRegister = () => {
    // TODO: verify data
    // TODO: confirm password
    const registerInfo = this.state.register
    log.info(`Register request for ${registerInfo.email}`)
    this.props.register(registerInfo)
  }

  loginButtons = [
    <RaisedButton
      primary={true}
      label='Register new user'
      fullWidth={true}
      onClick={this.handleSwitchToRegister}
    />
  ]

  registerButtons = [
    <RaisedButton
      primary={true}
      label='Back to login'
      fullWidth={true}
      onClick={this.handleSwitchToLogin}
    />
  ]

  // TODO: Show an error if wrong credentials are used
  // TODO: Password reset mode
  render () {
    let form, title, buttons
    switch (this.state.mode) {
      case MODE_LOGIN:
        form = <LoginForm values={this.state.login}
                          onChange={this.handleChangeLogin}
                          onSubmit={this.handleSubmitLogin} />
        title = 'Login'
        buttons = this.loginButtons
        break
      case MODE_REGISTER:
        form = <RegisterForm values={this.state.register}
                             onChange={this.handleChangeRegister}
                             onSubmit={this.handleSubmitRegister} />
        title = 'Register'
        buttons = this.registerButtons
        break
      default:
        // TODO: do something here
    }

    return (
      <Dialog
        title={title}
        actions={buttons}
        open={!this.props.authenticated}
      >
        {form}
      </Dialog>
    )
  }
}
