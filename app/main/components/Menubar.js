import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import Popover from 'material-ui/Popover'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'

import { openInventoryEditor, loadInventory } from '../actions'
import { logoutUser } from '../../common/actions/auth'
import t from '../../common/i18n'
import Sidebar from './Sidebar'

// BUG: inventory menu gets screwy when no inventories exist

const inventoryMenuReduxWrapper = connect(
  undefined, {loadInventory, openInventoryEditor})
class InventoryMenuComponent extends React.Component {
  static propTypes = {
    inventories: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    openInventoryEditor: PropTypes.func.isRequired,
    loadInventory: PropTypes.func.isRequired
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
            event.preventDefault() // prevent ghost click
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
                    this.props.loadInventory(inventory.id)
                  }} />
              )
            }) }
            <Divider />
            <MenuItem primaryText={t('menu.addInventory')}
              onTouchTap={ () => {
                this.handleRequestClose()
                this.props.openInventoryEditor()
              }} />
          </Menu>
        </Popover>
      </div>
    )
  }
}
const InventoryMenu = inventoryMenuReduxWrapper(InventoryMenuComponent)

const menubarReduxWrapper = connect(
  function mapStateToProps (state) {
    const currentInventory = state.database.inventories[state.ui.currentInventory]
    return {
      inventories: state.database.inventories,
      // TODO: Handle no inventories exist
      inventoryName: currentInventory ? currentInventory.name : 'Loading...'
    }
  },
  {logoutUser}
)
class MenubarComponent extends React.Component {
  static propTypes = {
    inventories: PropTypes.array.isRequired,
    inventoryName: PropTypes.string.isRequired,
    logoutUser: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {sidebarOpen: false}
  }

  // TODO: Special handling for no inventories exist
  render () {
    return (
      <div>
        <Sidebar open={this.state.sidebarOpen}
          onClose={() => { this.setState({sidebarOpen: false}) }}
          onLogout={this.props.logoutUser}/>
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
const Menubar = menubarReduxWrapper(MenubarComponent)

export default Menubar
