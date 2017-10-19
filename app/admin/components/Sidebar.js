import React from 'react'
import { connect } from 'react-redux'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import IconCurrentPanel from 'material-ui/svg-icons/navigation/chevron-right'

import { selectPanel } from '../actions'
import t from '../../common/i18n'

const panels = ['overview', 'userManagement', 'adminManagement']
const reduxWrapper = connect(
  function mapStateToProps (state) {
    return {activePanel: state.activePanel}
  },
  {selectPanel}
)
// TODO: Find a way to use a static width instead of percentage (no pixels)
const Sidebar = reduxWrapper(({activePanel, selectPanel}) => {
  const menuItems = []
  for (const panelName of panels) {
    menuItems.push(<MenuItem
      onClick={selectPanel(panelName)}
      rightIcon={activePanel === panelName ? <IconCurrentPanel /> : undefined}
      key={panelName}
    >{t(`panel.${panelName}`)}</MenuItem>)
  }

  return <Drawer open={true} width='25%'>
    {menuItems}
  </Drawer>
})

export default Sidebar
