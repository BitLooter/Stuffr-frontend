import React from 'react'
import {connect} from 'react-redux'
import log from 'loglevel'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import {loginUser} from '../actions'

@connect(
  function mapStateToProps (state) {
    return {
      authenticated: state.ui.authorized
    }
  }
)
export default class LoginDialog extends React.Component {
  getLoginInfo () {
    return {email: this.refs.email.getValue(),
            password: this.refs.password.getValue()}
  }
  handleDone = () => {
    // TODO: verify data
    const loginInfo = this.getLoginInfo()
    log.info(`Login request for ${loginInfo.email}`)
    this.props.dispatch(loginUser(loginInfo.email, loginInfo.password))
  }

  buttons = [
    <div>
      <RaisedButton
        primary={true}
        label='Login'
        fullWidth={true}
        onClick={this.handleDone}
      />
    </div>
  ]

  // TODO: Show an error if wrong credentials are used
  // TODO: Password reset button
  render () {
    return (
      <Dialog
        title='Login'
        actions={this.buttons}
        open={!this.props.authenticated}
      >
        <TextField name='email' ref='email'
          floatingLabelText='Email' /> <br />
        <TextField name='password' ref='password'
          floatingLabelText='Password' type='password' />
      </Dialog>
    )
  }
}
