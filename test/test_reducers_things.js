/* eslint-env mocha */
// TODO: Test error conditions

import {expect} from 'chai'
import log from 'loglevel'
import 'mocha-sinon'
import Immutable from 'seamless-immutable'

import {TEST_THINGS, NEW_THING, NEW_THING_ID} from './dummydata'
import {__GetDependency__} from '../app/reducers/things'
import * as actions from '../app/actions'

const initialState = Immutable([])

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
    expect(getThingListDoneReducer(initialState, action)).to.eql(TEST_THINGS)
  })

  it('Adding a new thing completed', () => {
    const postThingDoneReducer = __GetDependency__('postThingDoneReducer')
    const newWithId = {id: NEW_THING_ID, ...NEW_THING}
    const expectedState = Immutable([newWithId])
    const action = actions.postThingDone(newWithId)
    const newState = postThingDoneReducer(initialState, action)
    expect(newState).to.eql(expectedState)
  })

  it('Updating an existing thing completed', () => {
    const updateThingDoneReducer = __GetDependency__('updateThingDoneReducer')
    const updateData = {name: 'UPDATED'}
    let expectedState = TEST_THINGS.asMutable({deep: true})
    expectedState[0].name = 'UPDATED'
    expectedState = Immutable(expectedState)
    const action = actions.updateThingDone({id: TEST_THINGS[0].id, update: updateData})
    const newState = updateThingDoneReducer(TEST_THINGS, action)
    expect(newState).to.eql(expectedState)
  })

  it('Deleting a thing completed', () => {
    const deleteThingDoneReducer = __GetDependency__('deleteThingDoneReducer')
    const deleteThingId = TEST_THINGS[0].id
    const expectedState = Immutable([TEST_THINGS[1]])
    const action = actions.deleteThingDone(deleteThingId)
    const newState = deleteThingDoneReducer(TEST_THINGS, action)
    expect(newState).to.eql(expectedState)
  })
})
