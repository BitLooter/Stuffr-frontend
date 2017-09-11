import React from 'react'
import { connect } from 'react-redux'

import AuthenticationManager from '../../components/AuthenticationManager'
import Sidebar from './Sidebar'
import StatusPanel from './StatusPanel'
import UserPanel from './UserPanel'

const panelComponents = {
  overview: <StatusPanel />,
  userManagement: <UserPanel />
}
const reduxWrapper = connect(
  function mapStateToProps (state) {
    return {activePanel: state.activePanel}
  }
)
const AdminApp = reduxWrapper(({activePanel}) => {
  // let panel
  const panel = activePanel in panelComponents
    ? panelComponents[activePanel]
    : <div>UNKNOWN PANEL TYPE: {activePanel}</div>

  return <div>
    <AuthenticationManager>
      <Sidebar />
      {/* marginLeft should be the same as the sidebar width */}
      <div style={{marginLeft: '25%'}} >
        {panel}
      </div>
    </AuthenticationManager>
  </div>
})

export default AdminApp
