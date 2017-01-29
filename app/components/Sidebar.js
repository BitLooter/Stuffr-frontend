import React from 'react'
import {connect} from 'react-redux'
import Drawer from 'material-ui/Drawer'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back'

const Sidebar = ({open, onClose, onLogout}) =>
  <Drawer open={open}>
    <h1>Stuffr</h1>
    <FlatButton
      icon={<ArrowBackIcon />}
      onTouchTap={onClose}
    />
    <RaisedButton label='Logout'
                  onTouchTap={() => {
                    onClose()
                    onLogout()
                  }} />
  </Drawer>

const SidebarContainer = connect()(Sidebar)
export default SidebarContainer
