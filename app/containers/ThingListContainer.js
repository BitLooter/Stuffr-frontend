import React from 'react'
import {connect} from 'react-redux'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'

import {editThing} from '../actions'

const mapStateToProps = (state) => {
  return {things: state.things.toJS()}
}

const ThingList = ({ dispatch, things, updateUI }) =>
  <Table multiSelectable onCellClick={(row) => {
    dispatch(editThing(things[row]))
  }}>
    <TableHeader>
      <TableRow>
        <TableHeaderColumn>ID</TableHeaderColumn>
        <TableHeaderColumn>Name</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
      {things.map((thing) =>
        <TableRow key={thing.id}>
          <TableRowColumn>{thing.id}</TableRowColumn>
          <TableRowColumn>{thing.name}</TableRowColumn>
        </TableRow>
      )}
    </TableBody>
  </Table>
ThingList.proptypes = {
  dispatch: React.PropTypes.func.isRequired,
  things: React.PropTypes.array.isRequired,
  onThingClick: React.PropTypes.func.isRequired
}

const ThingListContainer = connect(
  mapStateToProps
)(ThingList)
export default ThingListContainer
