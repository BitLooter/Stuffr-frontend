/* eslint-env mocha */

import {expect} from 'chai'
import * as immutable from 'immutable'
import 'mocha-sinon'

import {testThings, newThing, newThingId} from './dummydata'
import {__GetDependency__} from '../app/reducers/things'
import * as actions from '../app/actions'
const genericErrorReducer = __GetDependency__('genericErrorReducer')
const getThingListDoneReducer = __GetDependency__('getThingListDoneReducer')
const postThingDoneReducer = __GetDependency__('postThingDoneReducer')

const initialState = immutable.List()

describe('Error Reducers:', () => {
  it('Generic error', function () {
    const errorMessage = 'Unit test error'
    const errorAction = {type: 'DUMMY_ERROR', payload: errorMessage}
    this.sinon.stub(console, 'error')
    expect(genericErrorReducer(initialState, errorAction))
      .to.equal(initialState)
    expect(console.error.calledOnce).to.be.true
    expect(console.error.calledWith(errorMessage)).to.be.true
  })
})

describe('Things reducers:', () => {
  it('Get all things completed', () => {
    const expectedState = immutable.List(testThings)
    const action = actions.getThingListDone(testThings)
    expect(getThingListDoneReducer(initialState, action))
      .to.eql(expectedState)
  })

  it('Adding a new thing completed', function () {
    const newWithId = {id: newThingId, ...newThing}
    const expectedState = immutable.List([newWithId])
    const action = actions.postThingDone(newWithId)
    const newState = postThingDoneReducer(initialState, action)
    expect(newState.toJS()).to.eql(expectedState.toJS())
  })
})
