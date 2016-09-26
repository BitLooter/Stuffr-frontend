import React from 'react'
import {connect} from 'react-redux'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'

const Menubar = () =>
  <Toolbar>
    <ToolbarGroup>
      <ToolbarTitle text='Stuffr' />
    </ToolbarGroup>
  </Toolbar>

const MenubarContainer = connect()(Menubar)
export default MenubarContainer
