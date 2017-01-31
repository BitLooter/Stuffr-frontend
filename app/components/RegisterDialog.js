import React from 'react'
import {connect} from 'react-redux'
import log from 'loglevel'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import {registerUser} from '../actions'

@connect(
  undefined,
  function mapDispatchToProps (dispatch) {
    return {
      register: (registerInfo) => { dispatch(registerUser(registerInfo)) }
    }
  }
)
export default class RegisterDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      password_confirm: '',
      name_first: '',
      name_last: ''
    }
  }

  // Event handlers
  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    const newData = {[name]: value}
    this.setState({...this.state.register, ...newData})
  }

  handleSubmit = () => {
    // TODO: verify data
    // TODO: confirm password
    const registerInfo = this.state
    log.info(`Register request for ${registerInfo.email}`)
    this.props.register(registerInfo)
  }

  // TODO: Show an error if wrong credentials are used
  // TODO: Password reset mode
  render () {
    const buttons = [
      <RaisedButton
        primary={true}
        label='Back to login'
        fullWidth={true}
        onClick={this.props.onSwitchToLogin}
      />
    ]

    const passwordError = this.state.password !== this.state.password_confirm
      ? 'Passwords do not match'
      : undefined

    return (
      <Dialog
        title='Register'
        actions={buttons}
        open={true}
      >
        <TextField name='email' onBlur={this.handleChange}
          floatingLabelText='Email' /> <br />
        <TextField name='password' onBlur={this.handleChange}
          floatingLabelText='Password' type='password'
          errorText={passwordError} /> <br />
        {/* TODO: check passwords with onChange to report status without blur */}
        <TextField name='password_confirm' onBlur={this.handleChange}
          floatingLabelText='Password again' type='password'
          errorText={passwordError} /> <br />
        <TextField name='name_first' onBlur={this.handleChange}
          floatingLabelText='First name' />
        <TextField name='name_last' onBlur={this.handleChange}
          floatingLabelText='Last name' /> <br />
        <RaisedButton
          primary={true}
          label='Register'
          fullWidth={true}
          onClick={this.handleSubmit}
        />
      </Dialog>
    )
  }
}
