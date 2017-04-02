import React from 'react'
import {connect} from 'react-redux'
import i18next from 'i18next'
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import Popover from 'material-ui/Popover'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'

import Sidebar from './Sidebar'
import {openInventoryEditor, logoutUser, loadInventory} from '../actions'

// BUG: inventory menu gets screwy when no inventories exist

@connect(
  undefined,
  function mapDispatchToProps (dispatch) {
    return {
      selectInventory: (id) => { dispatch(loadInventory(id)) },
      addInventory: () => { dispatch(openInventoryEditor()) }
    }
  }
)
class InventoryMenu extends React.Component {
  static propTypes = {
    inventories: React.PropTypes.array.isRequired,
    title: React.PropTypes.string.isRequired,
    addInventory: React.PropTypes.func.isRequired,
    selectInventory: React.PropTypes.func.isRequired
  }
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
          <Menu>
            {this.props.inventories.map((inventory) => {
              return (
                <MenuItem primaryText={inventory.name} key={inventory.id}
                          onTouchTap={() => {
                            this.handleRequestClose()
                            this.props.selectInventory(inventory.id)
                          }} />
              )
            }) }
            <Divider />
            <MenuItem primaryText={i18next.t('menu.addInventory')}
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

@connect(
  function mapStateToProps (state) {
    const currentInventory = state.database.inventories[state.ui.currentInventory]
    return {
      inventories: state.database.inventories,
      // TODO: Handle no inventories exist
      inventoryName: currentInventory ? currentInventory.name : 'Loading...',
      authenticated: state.database.user !== null
    }
  },
  function mapDispatchToProps (dispatch) {
    return {
      logOut: () => dispatch(logoutUser())
    }
  }
)
class Menubar extends React.Component {
  static propTypes = {
    inventories: React.PropTypes.array.isRequired,
    inventoryName: React.PropTypes.string.isRequired,
    logOut: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {sidebarOpen: false}
  }

  render () {
    return (
      <div>
        <Sidebar open={this.state.sidebarOpen}
                 onClose={() => { this.setState({sidebarOpen: false}) }}
                 onLogout={this.props.logOut}/>
        <Toolbar>
          <ToolbarGroup>
            <FlatButton icon={<MenuIcon />}
                        onTouchTap={
                          () => {
                            this.setState({sidebarOpen: true})
                          }}
            />
            <InventoryMenu title={this.props.inventoryName}
                           inventories={this.props.inventories} />
          </ToolbarGroup>
        </Toolbar>
      </div>
    )
  }
}

export default Menubar
