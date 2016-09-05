import React from 'react'
import {connect} from 'react-redux'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import ThingListContainer from './ThingListContainer'
import ThingEditDialogContainer from './ThingEditDialogContainer'
import {createNewThing} from '../actions'

@connect()
export default class App extends React.Component {
  render () {
    return (
      <div className='app'>
        <ThingListContainer />
        <ThingEditDialogContainer show={false} />
        <FloatingActionButton className='actionButton' onClick={() => this.props.dispatch(createNewThing())}>
          +
        </FloatingActionButton>
      </div>
  ) }
}
