import React from 'react'
import PropTypes from 'prop-types'
import Drawer from 'material-ui/Drawer'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back'

import t from '../../common/i18n'

const AboutDialog = ({open, onClose}) =>
  <Dialog
    open={open}
    modal={true}
    actions={<RaisedButton label={t('common.close')} onTouchTap={onClose} />}
  >
    {/* Doing a half-assed dynamic template thing here, if more strings like this are done in
        the future this should be replaced with something like an sprintf library. */}
    {t('about.text').replace('$VERSION', global.siteConfig.frontendVersion)}
  </Dialog>
AboutDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default class Sidebar extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      aboutDialogOpen: false
    }
  }

  render () {
    return (
      <Drawer open={this.props.open}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <div style={{flex: 1}}>
            <h1>Stuffr</h1>
            <FlatButton
              icon={<ArrowBackIcon />}
              onTouchTap={this.props.onClose}
            />
            <RaisedButton label={t('auth.logout')}
              onTouchTap={() => {
                this.props.onClose()
                this.props.onLogout()
              }} />
          </div>
          <div>
            <FlatButton
              label={t('menu.about')}
              onTouchTap={() => this.setState({aboutDialogOpen: true})}
            />
          </div>
        </div>
        <AboutDialog open={this.state.aboutDialogOpen}
          onClose={() => { this.setState({aboutDialogOpen: false}) }} />
      </Drawer>
    )
  }
}
