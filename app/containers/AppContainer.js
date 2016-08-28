import React from 'react'
import {connect} from 'react-redux'
import ui from 'redux-ui'

import AddThingContainer from './AddThingContainer'
import ThingListContainer from './ThingListContainer'
import ThingEditDialogContainer from './ThingEditDialogContainer'
import {defaultUIState, setUpdateUIFunction} from '../uistate'

@connect()
@ui({
  state: defaultUIState
})
export default class App extends React.Component {
  constructor (props) {
    super(props)
    setUpdateUIFunction(props.updateUI)
  }

  render () {
    return (
      <div>
        <AddThingContainer />
        <ThingListContainer />
        <ThingEditDialogContainer />
      </div>
  ) }
}
