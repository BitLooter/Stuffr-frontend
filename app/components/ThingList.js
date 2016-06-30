import React, { PropTypes } from 'react'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'

// const ThingListItem = ({ onClick, completed, name }) =>
//   <li onClick={onClick}>{name}</li>
// ThingListItem.propTypes = {name: PropTypes.string.isRequired}

const ThingList = ({ things, onThingClick }) =>
  <Table multiSelectable={true} onCellClick={onThingClick} selectable={false}>
    <TableHeader>
      <TableRow>
        <TableHeaderColumn>ID</TableHeaderColumn>
        <TableHeaderColumn>Name</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
      {things.map(thing =>
        <TableRow key={thing.id} onClick={() => onThingClick(thing.id)}>
          <TableRowColumn>{thing.id}</TableRowColumn>
          <TableRowColumn>{thing.name}</TableRowColumn>
        </TableRow>
      )}
    </TableBody>
  </Table>
// const ThingList = ({ things, onThingClick }) =>
//   <ul>
//     {things.map(thing =>
//       <ThingListItem
//         key={thing.id}
//         name={thing.name}
//         onClick={() => onThingClick(thing.id)}
//       />
//     )}
//   </ul>

export default ThingList
