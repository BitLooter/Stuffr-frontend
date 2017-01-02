import React from 'react'
import {connect} from 'react-redux'
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import Popover from 'material-ui/Popover'
import RaisedButton from 'material-ui/RaisedButton'

import {loginUser, createNewInventory} from '../actions'

// PopMenu - Like a dropdown, but with a full menu instead. Child items should
// be MenuItems.
class PopMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {open: false}
  }
  handleRequestClose = () => {
    this.setState({
      open: false
    })
  }
  render () {
    return (
      <div>
        <RaisedButton label={this.props.title}
                      onTouchTap={(e) => {
                        event.preventDefault()  // prevent ghost click
                        this.setState({open: true, anchor: e.currentTarget})
                      }}
        />
        <Popover open={this.state.open} anchorEl={this.state.anchor}
                 onRequestClose={() => { this.setState({open: false}) }}>
          <Menu>{this.props.children}</Menu>
        </Popover>
      </div>
  ) }
}

// TODO: disable inventory menu when logged out
const Menubar = ({dispatch, inventories, inventoryName, authenticated}) =>
  <Toolbar>
    <ToolbarGroup>
      <PopMenu title={inventoryName}>
        {inventories.map((i) =>
          <MenuItem primaryText={i.name} key={inventories.indexOf(i)}/>
        ) }
        <Divider />
        <MenuItem primaryText='Add a new inventory...'
                  onTouchTap={() => {
                    // TOOD: close menu on click
                    dispatch(createNewInventory())
                  }}/>
      </PopMenu>
    </ToolbarGroup>
    <ToolbarGroup>
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
    inventories: state.database.inventories,
    inventoryName: currentInventory ? currentInventory.name : 'Loading...',
    authenticated: state.database.user !== null
  }
}

const MenubarContainer = connect(mapStateToProps)(Menubar)
export default MenubarContainer
