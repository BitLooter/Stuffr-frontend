// Dummy data to be shared among test cases

import Immutable from 'seamless-immutable'

export const TEST_DOMAIN = 'https://example.com'

export const TEST_THINGS = Immutable([
  {id: 1, name: 'THING1',
   date_created: '1970-01-01T00:00:00Z',
   date_modified: '1970-01-01T00:00:00Z',
   description: 'THING1_DESC',
   notes: 'THING1_NOTES'},
  {id: 2, name: 'THING2',
   date_created: '1970-01-01T00:00:00Z',
   date_modified: '1970-01-01T00:00:00Z',
   description: 'THING2_DESC',
   notes: 'THING2_NOTES'}
])

export const NEW_THING = Immutable({
  name: 'NEWTHING',
  description: 'NEWDESC',
  notes: 'NEWNOTES'
})

export const NEW_THING_ID = 42
