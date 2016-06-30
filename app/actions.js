import { createAction } from 'redux-actions'

export const ADD_THING = 'ADD_THING'
export const SHOW_THING_INFO = 'SHOW_THING_INFO'

let nextThingID = 0

export const addThing = createAction(ADD_THING, name => {
  return {
    id: nextThingID++,
    name
  }
})

export const showThingInfo = createAction(SHOW_THING_INFO)
