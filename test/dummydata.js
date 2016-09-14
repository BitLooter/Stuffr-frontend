// Dummy data to be shared among test cases

import Immutable from 'seamless-immutable'

export const TEST_DOMAIN = 'https://example.com'

export const TEST_THINGS = Immutable([
  {id: 1, name: 'THING1',
   date_created: '1970-01-01T00:00:00Z', date_updated: '1970-01-01T00:00:00Z'},
  {id: 2, name: 'THING2',
   date_created: '1970-01-01T00:00:00Z', date_updated: '1970-01-01T00:00:00Z'}
])

export const NEW_THING = {
  name: 'NEWTHING'
}
export const NEW_THING_ID = 42
