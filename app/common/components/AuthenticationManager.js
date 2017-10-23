import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import log from 'loglevel'

import LoginDialog from './LoginDialog'
import RegisterDialog from './RegisterDialog'

const MODE_LOGIN = Symbol('MODE_LOGIN')
const MODE_REGISTER = Symbol('MODE_REGISTER')

@connect(
  function mapStateToProps (state) {
    return {
      authenticated: state.auth.authenticated
    }
  }
)
export default class AuthenticationManager extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    authenticated: PropTypes.bool.isRequired,
    onLogin: PropTypes.func.isRequired,
    onRegister: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      mode: MODE_LOGIN
    }
  }

  switchMode (mode) {
    log.info(`Authentication mode switching to ${String(mode)}`)
    this.setState({mode})
  }

  render () {
    let component
    // TODO: Password reset mode
    if (this.props.authenticated) {
      // Rest of the UI is only rendered if user is authenticated
      component = <div>{this.props.children}</div>
    } else if (this.state.mode === MODE_LOGIN) {
      // TODO: Allow to disable user register button
      component = <LoginDialog
        onLogin={this.props.onLogin}
        handleSwitchToRegister={() => this.switchMode(MODE_REGISTER)} />
    } else if (this.state.mode === MODE_REGISTER) {
      component = <RegisterDialog
        onRegister={this.props.onRegister}
        handleSwitchToLogin={() => this.switchMode(MODE_LOGIN)} />
    }

    return component
  }
}
