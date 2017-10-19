import React from 'react'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'

const reduxWrapper = connect(
  function mapStateToProps (state) {
    return {
      numUsers: state.stats.numUsers,
      numInventories: state.stats.numInventories,
      numThings: state.stats.numThings,
      serverVersion: state.serverInfo.version
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
// StatusPanel.propTypes = {
//   numUsers: PropTypes.number.isRequired,
//   numInventories: PropTypes.number.isRequired,
//   numThings: PropTypes.number.isRequired,
//   serverVersion: PropTypes.string.isRequired
// }

export default StatusPanel
