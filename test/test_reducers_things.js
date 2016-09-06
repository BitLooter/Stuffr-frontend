/* eslint-env mocha */
// TODO: Test error conditions

import {expect} from 'chai'
import * as immutable from 'immutable'
import 'mocha-sinon'
import log from 'loglevel'

import {testThings, newThing, newThingId} from './dummydata'
import {__GetDependency__} from '../app/reducers/things'
import * as actions from '../app/actions'

const initialState = immutable.List()
const loadedState = immutable.fromJS(testThings)

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
    const action = actions.getThingListDone(testThings)
    expect(getThingListDoneReducer(initialState, action).toJS())
      .to.eql(loadedState.toJS())
  })

  it('Adding a new thing completed', () => {
    const postThingDoneReducer = __GetDependency__('postThingDoneReducer')
    const newWithId = {id: newThingId, ...newThing}
    const expectedState = immutable.List([newWithId])
    const action = actions.postThingDone(newWithId)
    const newState = postThingDoneReducer(initialState, action)
    expect(newState.toJS()).to.eql(expectedState.toJS())
  })

  it('Updating an existing thing completed', () => {
    const updateThingDoneReducer = __GetDependency__('updateThingDoneReducer')
    const updateData = {name: 'UPDATED'}
    // Deep copy test data before changing it
    let expectedState = immutable.fromJS(testThings).toJS()
    expectedState[0].name = 'UPDATED'
    expectedState = immutable.fromJS(expectedState)
    const action = actions.updateThingDone({id: testThings[0].id, update: updateData})
    const newState = updateThingDoneReducer(loadedState, action)
    expect(newState.toJS()).to.eql(expectedState.toJS())
  })

  it('Deleting a thing completed', () => {
    const deleteThingDoneReducer = __GetDependency__('deleteThingDoneReducer')
    const deleteThingId = testThings[0].id
    const expectedState = immutable.fromJS(testThings).delete(0)
    const action = actions.deleteThingDone(deleteThingId)
    const newState = deleteThingDoneReducer(loadedState, action)
    expect(newState.toJS()).to.eql(expectedState.toJS())
  })
})
