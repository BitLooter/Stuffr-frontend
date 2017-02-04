import React from 'react'
import {connect} from 'react-redux'
import i18next from 'i18next'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'

import {ui} from '../actions'

// TODO: Height needs to be set to the height of the window
const ThingList = ({ things, editThing }) =>
  <Table multiSelectable height='700px' onCellClick={(row) => {
    editThing(things[row])
  }}>
    <TableHeader>
      <TableRow>
        <TableHeaderColumn>{i18next.t('thingList.nameHeader')}</TableHeaderColumn>
        <TableHeaderColumn>{i18next.t('thingList.descHeader')}</TableHeaderColumn>
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

const ThingListContainer = connect(
  function mapStateToProps (state) {
    return {things: state.database.things}
  },
  function mapDispatchToProps (dispatch) {
    return {
      editThing: (thing) => {
        dispatch(ui.editThing(thing))
      }
    }
  }
)(ThingList)
export default ThingListContainer
