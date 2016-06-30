import React, { PropTypes } from 'react'

const ThingListItem = ({ onClick, completed, name }) =>
  <li onClick={onClick}>{name}</li>
ThingListItem.propTypes = {name: PropTypes.string.isRequired}

const ThingList = ({ things, onThingClick }) =>
  <ul>
    {things.map(thing =>
      <ThingListItem
        key={thing.id}
        name={thing.name}
        onClick={() => onThingClick(thing.id)}
      />
    )}
  </ul>

export default ThingList
