import React from 'react'
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()  // Needed for material-ui

import { addThing } from '../actions'

class AddThing extends React.Component {
  static proptypes = { dispatch: React.PropTypes.func.isRequired }

  constructor (props) {
    super(props)
    this.dispatch = props.dispatch
  }

  handleSubmit = e => {
    e.preventDefault()
    this.dispatch(addThing({name: this.refs.thingName.getValue()}))
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField ref='thingName' name='thingName' />
        <RaisedButton type='submit'>Add thing</RaisedButton>
      </form>
    )
  }
}

const AddThingContainer = connect()(AddThing)

export default AddThingContainer
