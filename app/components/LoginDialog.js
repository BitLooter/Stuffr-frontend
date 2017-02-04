import React from 'react'
import {connect} from 'react-redux'
import i18next from 'i18next'
// import {t} from 'i18next'
import log from 'loglevel'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import {loginUser} from '../actions'

@connect(
  undefined,
  function mapDispatchToProps (dispatch) {
    return {
      login: (email, password) => { dispatch(loginUser(email, password)) }
    }
  }
)
export default class LoginDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  // Event handlers
  handleChange = (e) => {
    const newData = {[e.target.name]: e.target.value}
    this.setState({...this.state, ...newData})
  }

  handleSubmit = () => {
    // TODO: verify data
    const loginInfo = this.state
    log.info(`Login request for ${loginInfo.email}`)
    this.props.login(loginInfo.email, loginInfo.password)
  }

  // TODO: Show an error if wrong credentials are used
  render () {
    const loginButtons = [
      <RaisedButton
        primary={true}
        label={i18next.t('auth.switchToRegister')}
        fullWidth={true}
        onTouchTap={this.props.onSwitchToRegister}
      />
    ]

    return (
      <Dialog
        title={i18next.t('auth.loginTitle')}
        actions={loginButtons}
        open={true}
      >
        <TextField name='email' onChange={this.handleChange}
          floatingLabelText={i18next.t('auth.email')} /> <br />
        <TextField name='password' onChange={this.handleChange}
          floatingLabelText={i18next.t('auth.password')} type='password' /> <br />
        <RaisedButton
          primary={true}
          label={i18next.t('auth.loginSubmit')}
          fullWidth={true}
          onTouchTap={this.handleSubmit}
        />
      </Dialog>
    )
  }
}
