import React from 'react'
import {connect} from 'react-redux'
import ui from 'redux-ui'

import AddThingContainer from './AddThingContainer'
import ThingListContainer from './ThingListContainer'
import ThingEditDialogContainer from './ThingEditDialogContainer'
import {createThingDialogState} from '../uistate'

let App = () => (
  <div>
    <AddThingContainer />
    <ThingListContainer />
    <ThingEditDialogContainer />
  </div>
)

App = ui({
  state: {
    thingDialog: createThingDialogState(false)
  }
})(App)
const AppContainer = connect()(App)

export default AppContainer
