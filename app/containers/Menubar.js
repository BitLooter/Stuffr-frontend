import React from 'react'
import {connect} from 'react-redux'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'

const Menubar = ({inventoryName}) =>
  <Toolbar>
    <ToolbarGroup>
      <ToolbarTitle text={inventoryName} />
    </ToolbarGroup>
  </Toolbar>

function mapStateToProps (state) {
  const currentInventory = state.database.inventories[0]
  return {inventoryName: currentInventory ? currentInventory.name : 'Loading...'}
}

const MenubarContainer = connect(mapStateToProps)(Menubar)
export default MenubarContainer
