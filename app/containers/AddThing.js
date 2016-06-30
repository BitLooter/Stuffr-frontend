import React from 'react'
import { connect } from 'react-redux'
import { addThing } from '../actions'

class AddThing extends React.Component {
  constructor (props) {
    super(props)
    this.dispatch = props.dispatch
  }
  handleSubmit (e) {
    e.preventDefault()
    this.dispatch(addThing(this.refs.thingName.value))
  }
  render () {
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <input ref='thingName' type='text' />
        <button type='submit'>Add thing</button>
      </form>
    )
  }
}

const AddThingContainer = connect()(AddThing)

export default AddThingContainer
