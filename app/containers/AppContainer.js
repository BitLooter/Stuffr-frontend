import React from 'react'
import {connect} from 'react-redux'

import AddThingContainer from './AddThingContainer'
import ThingListContainer from './ThingListContainer'
import ThingEditDialogContainer from './ThingEditDialogContainer'

@connect()
export default class App extends React.Component {
  render () {
    return (
      <div>
        <AddThingContainer />
        <ThingListContainer />
        <ThingEditDialogContainer show={false} />
      </div>
  ) }
}
