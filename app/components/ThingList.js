import React from 'react'
import {connect} from 'react-redux'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'

import {editThing} from '../actions'

// TODO: Height needs to be set to the height of the window
const ThingList = ({ dispatch, things }) =>
  <Table multiSelectable height='700px' onCellClick={(row) => {
    dispatch(editThing(things[row]))
  }}>
    <TableHeader>
      <TableRow>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Description</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody showRowHover>
      {things.map((thing) =>
        <TableRow key={thing.id}>
          <TableRowColumn>{thing.name}</TableRowColumn>
          <TableRowColumn>{thing.description}</TableRowColumn>
        </TableRow>
      )}
    </TableBody>
  </Table>
ThingList.proptypes = {
  dispatch: React.PropTypes.func.isRequired,
  things: React.PropTypes.array.isRequired
}

function mapStateToProps (state) {
  return {things: state.database.things}
}

const ThingListContainer = connect(
  mapStateToProps
)(ThingList)
export default ThingListContainer
