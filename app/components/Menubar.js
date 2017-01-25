import React from 'react'
import {connect} from 'react-redux'
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import Popover from 'material-ui/Popover'
import RaisedButton from 'material-ui/RaisedButton'

import {ui, logoutUser, loadInventory} from '../actions'

// BUG: inventory menu gets screwy when no inventories exist

@connect(
  undefined,
  function mapDispatchToProps (dispatch) {
    return {
      selectInventory: (index) => { dispatch(loadInventory(index)) },
      addInventory: () => { dispatch(ui.createNewInventory()) }
    }
  }
)
class InventoryMenu extends React.Component {
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
    const inventories = this.props.inventories
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
          <Menu>
            {this.props.inventories.map((i) => {
              const index = inventories.indexOf(i)
              return (
                <MenuItem primaryText={i.name} key={index}
                          onTouchTap={() => {
                            this.handleRequestClose()
                            this.props.selectInventory(index)
                          }} />
              )
            }) }
            <Divider />
            <MenuItem primaryText='Add a new inventory...'
                      onTouchTap={ () => {
                        this.handleRequestClose()
                        this.props.addInventory()
                      }} />
          </Menu>
        </Popover>
      </div>
    )
  }
}

// TODO: disable inventory menu when logged out
const Menubar = ({inventories, inventoryName, authenticated, logOut}) =>
  <Toolbar>
    <ToolbarGroup>
      <InventoryMenu title={inventoryName} inventories={inventories} />
    </ToolbarGroup>
    <ToolbarGroup>
      <RaisedButton label='Logout'
                    primary={authenticated} secondary={!authenticated}
                    onTouchTap={logOut} />
    </ToolbarGroup>
  </Toolbar>

const MenubarContainer = connect(
  function mapStateToProps (state) {
    const currentInventory = state.database.inventories[state.ui.currentInventory]
    return {
      inventories: state.database.inventories,
      // TODO: Put something other than 'Loading...' when logged out
      inventoryName: currentInventory ? currentInventory.name : 'Loading...',
      authenticated: state.database.user !== null
    }
  },
  function mapDispatchToProps (dispatch) {
    return {
      logOut: () => dispatch(logoutUser())
    }
  }
)(Menubar)
export default MenubarContainer
