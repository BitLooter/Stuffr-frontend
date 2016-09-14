/* eslint-env mocha */
// TODO: Test error conditions

import {expect} from 'chai'
import * as immutable from 'immutable'
import log from 'loglevel'
import moment from 'moment'
import 'mocha-sinon'

import {TEST_THINGS, NEW_THING, NEW_THING_ID} from './dummydata'
import {__GetDependency__} from '../app/reducers/things'
import * as actions from '../app/actions'

const initialState = immutable.List()
const loadedStateMutable = []
for (const rawthing of TEST_THINGS) {
  const thing = rawthing.asMutable()
  thing.date_created = moment(thing.date_created)
  thing.date_modified = moment(thing.date_modified)
  loadedStateMutable.push(thing)
}
const loadedState = immutable.fromJS(loadedStateMutable)

describe('Error Reducers:', () => {
  it('Generic error', function () {
    const genericErrorReducer = __GetDependency__('genericErrorReducer')
    const errorMessage = 'Unit test dummy error'
    const errorAction = {type: 'DUMMY_ERROR', payload: errorMessage}
    this.sinon.stub(log, 'error')
    expect(genericErrorReducer(initialState, errorAction))
      .to.equal(initialState)
    expect(log.error.calledOnce).to.be.true
  })
})

describe('Things reducers:', () => {
  it('Get all things completed', () => {
    const getThingListDoneReducer = __GetDependency__('getThingListDoneReducer')
    const action = actions.getThingListDone(TEST_THINGS.asMutable())
    expect(getThingListDoneReducer(initialState, action).toJS())
      .to.eql(loadedState.toJS())
  })

  it('Adding a new thing completed', () => {
    const postThingDoneReducer = __GetDependency__('postThingDoneReducer')
    const newWithId = {id: NEW_THING_ID, ...NEW_THING}
    const expectedState = immutable.List([newWithId])
    const action = actions.postThingDone(newWithId)
    const newState = postThingDoneReducer(initialState, action)
    expect(newState.toJS()).to.eql(expectedState.toJS())
  })

  it('Updating an existing thing completed', () => {
    const updateThingDoneReducer = __GetDependency__('updateThingDoneReducer')
    const updateData = {name: 'UPDATED'}
    let expectedState = loadedState.toJS()
    expectedState[0].name = 'UPDATED'
    expectedState = immutable.fromJS(expectedState)
    const action = actions.updateThingDone({id: TEST_THINGS[0].id, update: updateData})
    const newState = updateThingDoneReducer(loadedState, action)
    expect(newState.toJS()).to.eql(expectedState.toJS())
  })

  it('Deleting a thing completed', () => {
    const deleteThingDoneReducer = __GetDependency__('deleteThingDoneReducer')
    const deleteThingId = TEST_THINGS[0].id
    const newThings = loadedState.toJS()
    newThings.shift()
    const expectedState = immutable.fromJS(newThings)
    const action = actions.deleteThingDone(deleteThingId)
    const newState = deleteThingDoneReducer(loadedState, action)
    expect(newState.toJS()).to.eql(expectedState.toJS())
  })
})
