import React from 'react'
import { connect } from 'react-redux'

const reduxWrapper = connect(
  function mapStateToProps (state) {
    return {
      users: state.server.users
    }
  }
)

const UserPanel = reduxWrapper(({users}) => <div>
  {users.map((user) => {
    return <span key={user.id}>{user.email}<br /></span>
  })}
</div>)

export default UserPanel
