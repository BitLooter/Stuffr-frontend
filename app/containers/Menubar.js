import React from 'react'
import {connect} from 'react-redux'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'
import RaisedButton from 'material-ui/RaisedButton'

import {loginUser} from '../actions'

const Menubar = ({dispatch, inventoryName, authenticated}) =>
  <Toolbar>
    <ToolbarGroup>
      <ToolbarTitle text={inventoryName} />
      <RaisedButton label={authenticated ? 'Logged in' : 'LOGGED OUT'}
                    primary={authenticated} secondary={!authenticated}
                    onTouchTap={() => {
                      dispatch(loginUser('default@example.com', 'password'))
                    }} />
    </ToolbarGroup>
  </Toolbar>

function mapStateToProps (state) {
  const currentInventory = state.database.inventories[0]
  return {
    inventoryName: currentInventory ? currentInventory.name : 'Loading...',
    authenticated: state.database.user !== null
  }
}

const MenubarContainer = connect(mapStateToProps)(Menubar)
export default MenubarContainer
