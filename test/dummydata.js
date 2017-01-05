// Dummy data to be shared among test cases

import Immutable from 'seamless-immutable'

export const TEST_DOMAIN = 'https://example.com'
export const TEST_AUTH_URL = `${TEST_DOMAIN}/auth`

export const TEST_TIME = '1970-01-01T00:00:00Z'

export const TEST_USER = {
  'id': 1,
  'email': 'default@example.com',
  'name_first': 'DEFAULT',
  'name_last': 'USER'
}

export const TEST_INVENTORIES = [
  {'id': 1,
   'name': 'Test inventory 1',
   'user_id': 1,
   'date_created': TEST_TIME},
  {'id': 2,
   'name': 'Test inventory 2',
   'user_id': 1,
   'date_created': TEST_TIME}
]

export const TEST_THINGS = Immutable([
  {id: 1, name: 'THING1',
   date_created: TEST_TIME,
   date_modified: TEST_TIME,
   description: 'THING1_DESC',
   notes: 'THING1_NOTES'},
  {id: 2, name: 'THING2',
   date_created: TEST_TIME,
   date_modified: TEST_TIME,
   description: 'THING2_DESC',
   notes: 'THING2_NOTES'}
])

export const TEST_DATABASE = Immutable({
  user: TEST_USER,
  inventories: TEST_INVENTORIES,
  things: TEST_THINGS
})

export const TEST_STORE = Immutable({
  database: TEST_DATABASE
})

export const NEW_INVENTORY = Immutable({
  name: 'NEWINVENTORY'
})

export const NEW_THING = Immutable({
  name: 'NEWTHING',
  description: 'NEWDESC',
  notes: 'NEWNOTES'
})

export const NEW_THING_ID = 42
export const NEW_INVENTORY_ID = 21
