import React from 'react'
import {connect} from 'react-redux'
import i18next from 'i18next'
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
        label={i18next.t('auth.switchToLogin')}
        fullWidth={true}
        onClick={this.props.onSwitchToLogin}
      />
    ]

    const passwordError = this.state.password !== this.state.password_confirm
      ? i18next.t('auth.passwordMismatch')
      : undefined

    return (
      <Dialog
        title={i18next.t('auth.registerTitle')}
        actions={buttons}
        open={true}
      >
        <TextField name='email' onBlur={this.handleChange}
          floatingLabelText={i18next.t('auth.email')} /> <br />
        <TextField name='password' onBlur={this.handleChange}
          floatingLabelText={i18next.t('auth.password')} type='password'
          errorText={passwordError} /> <br />
        {/* TODO: check passwords with onChange to report status without blur */}
        <TextField name='password_confirm' onBlur={this.handleChange}
          floatingLabelText={i18next.t('auth.passwordConfirm')} type='password'
          errorText={passwordError} /> <br />
        <TextField name='name_first' onBlur={this.handleChange}
          floatingLabelText={i18next.t('auth.nameFirst')} />
        <TextField name='name_last' onBlur={this.handleChange}
          floatingLabelText={i18next.t('auth.nameLast')} /> <br />
        <RaisedButton
          primary={true}
          label={i18next.t('auth.registerSubmit')}
          fullWidth={true}
          onClick={this.handleSubmit}
        />
      </Dialog>
    )
  }
}
