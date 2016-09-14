import { handleActions } from 'redux-actions'
import * as immutable from 'immutable'
import log from 'loglevel'
import moment from 'moment'

function genericErrorReducer (state, action) {
  log.error(`${action.type}: ${action.payload}`)
  return state
}

function getThingListDoneReducer (state, action) {
  const things = []
  for (const rawthing of action.payload) {
    const thing = {...rawthing}
    thing.date_created = moment(thing.date_created)
    thing.date_modified = moment(thing.date_modified)
    things.push(thing)
  }
  return immutable.fromJS(things)
}

function postThingDoneReducer (state, action) {
  return state.push(immutable.fromJS(action.payload))
}

function updateThingDoneReducer (state, action) {
  // Find existing thing and update it
  const [index, thing] = state.findEntry((t) => {
    // TODO: Handle entry not found
    return t.get('id') === action.payload.id
  })
  return state.set(index, thing.merge(action.payload.update))
}

function deleteThingDoneReducer (state, action) {
  const [index] = state.findEntry((t) => {
    // TODO: Handle entry not found
    return t.get('id') === action.payload
  })
  const newState = state.delete(index)
  return newState
}

const things = handleActions({
  GET_THING_LIST__DONE: getThingListDoneReducer,
  GET_THING_LIST__ERROR: genericErrorReducer,
  POST_THING__DONE: postThingDoneReducer,
  POST_THING__ERROR: genericErrorReducer,
  UPDATE_THING__DONE: updateThingDoneReducer,
  UPDATE_THING__ERROR: genericErrorReducer,
  DELETE_THING__DONE: deleteThingDoneReducer,
  DELETE_THING__ERROR: genericErrorReducer
}, immutable.List())

export default things
