import React from 'react'
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

import { addThing } from '../actions'

class AddThing extends React.Component {
  constructor (props) {
    super(props)
    // TODO: this code should be refactored once JS has property initializers
    this.dispatch = props.dispatch
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit (e) {
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
AddThing.propTypes = { dispatch: React.PropTypes.func }

const AddThingContainer = connect()(AddThing)

export default AddThingContainer
