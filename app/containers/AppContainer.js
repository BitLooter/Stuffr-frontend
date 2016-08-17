import React from 'react'
import { connect } from 'react-redux'
import ui from 'redux-ui'

import AddThingContainer from './AddThingContainer'
import ThingListContainer from './ThingListContainer'
import ThingEditDialogContainer from './ThingEditDialogContainer'

let App = () => (
  <div>
    <AddThingContainer />
    <ThingListContainer />
    <ThingEditDialogContainer />
  </div>
)

App = ui({
  state: {
    thingDialog: {open: false, thing: {name: 'YouShouldntSeeThis'}}
  }
})(App)
const AppContainer = connect()(App)

export default AppContainer
