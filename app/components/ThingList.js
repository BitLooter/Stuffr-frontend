import React from 'react'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
//  <Table multiSelectable onCellClick={onThingClick} selectable={false}>

const ThingList = ({ things, onThingClick }) =>
  <Table multiSelectable onCellClick={onThingClick}>
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

export default ThingList
