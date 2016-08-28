import React from 'react'
import {connect} from 'react-redux'
import i18next from 'i18next'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

import {postThing} from '../actions'
import {createThing} from '../models'

@connect()
export default class AddThing extends React.Component {
  static proptypes = { dispatch: React.PropTypes.func.isRequired }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.dispatch(postThing(createThing(this.refs.thingName.getValue())))
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField ref='thingName' name='thingName' />
        <RaisedButton type='submit'>{i18next.t('thing.add')}</RaisedButton>
      </form>
    )
  }
}
