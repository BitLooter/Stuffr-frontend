import React from 'react'
import { connect } from 'react-redux'

const reduxWrapper = connect(
  function mapStateToProps (state) {
    return {
      numUsers: state.server.stats.numUsers,
      numInventories: state.server.stats.numInventories,
      numThings: state.server.stats.numThings,
      serverVersion: state.server.info.version
    }
  }
)

const StatusPanel = reduxWrapper(({
  numUsers, numInventories, numThings,
  serverVersion
}) => {
  return (<div>
    Users: {numUsers}<br />
    Inventories: {numInventories}<br />
    Things: {numThings}<br />
    Server version: v{serverVersion}<br />
    Client version: v{window.siteConfig.frontendVersion}
  </div>)
})

export default StatusPanel
