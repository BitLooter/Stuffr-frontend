import i18next from 'i18next'
import React from 'react'
import Drawer from 'material-ui/Drawer'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back'

// Doing a half-assed dynamic template thing here, if more strings like this are done in
// the future this should be replaced with something like an sprintf library.
const AboutDialog = ({open, onClose}) =>
  <Dialog
    open={open}
    modal={true}
    actions={<RaisedButton label={i18next.t('common.close')} onTouchTap={onClose} />}
  >
    {/* Doing a half-assed dynamic template thing here, if more strings like this are done in
        the future this should be replaced with something like an sprintf library. */}
    {i18next.t('about.text').replace('$VERSION', window.siteConfig.frontendVersion)}
  </Dialog>
AboutDialog.propTypes = {
  open: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired
}

// TODO: Show current version somewhere
export default class Sidebar extends React.Component {
  static propTypes = {
    open: React.PropTypes.bool.isRequired,
    onClose: React.PropTypes.func.isRequired,
    onLogout: React.PropTypes.func.isRequired
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
            <RaisedButton label={i18next.t('menu.logout')}
                          onTouchTap={() => {
                            this.props.onClose()
                            this.props.onLogout()
                          }} />
          </div>
          <div>
            <FlatButton
              label={i18next.t('menu.about')}
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
