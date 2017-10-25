import React from 'react'
import { connect } from 'react-redux'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import IconCurrentPanel from 'material-ui/svg-icons/navigation/chevron-right'

import { selectPanel } from '../actions'
import { logoutUser } from '../../common/actions/auth'
import t from '../../common/i18n'

const panels = ['overview', 'userManagement', 'adminManagement']
const reduxWrapper = connect(
  function mapStateToProps (state) {
    return {activePanel: state.ui.activePanel}
  },
  {selectPanel, logoutUser}
)
// TODO: Find a way to use a static width instead of percentage (no pixels)
const Sidebar = reduxWrapper(({activePanel, selectPanel, logoutUser}) => {
  const menuItems = []
  for (const panelName of panels) {
    menuItems.push(<MenuItem
      onClick={selectPanel(panelName)}
      rightIcon={activePanel === panelName ? <IconCurrentPanel /> : undefined}
      key={panelName}
    >{t(`panel.${panelName}`)}</MenuItem>)
  }
  menuItems.push(<MenuItem
    onClick={logoutUser}
    key='_logout'
  >{t('logout')}</MenuItem>)

  return <Drawer open={true} width='25%'>
    {menuItems}
  </Drawer>
})

export default Sidebar
