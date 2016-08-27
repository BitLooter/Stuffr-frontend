/* eslint-env mocha */

import {expect} from 'chai'
import * as immutable from 'immutable'
import 'mocha-sinon'
import log from 'loglevel'

import {testThings, newThing, newThingId} from './dummydata'
import {__GetDependency__} from '../app/reducers/things'
import * as actions from '../app/actions'

const initialState = immutable.List()
const loadedState = immutable.List(testThings)

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
    expect(getThingListDoneReducer(initialState, action))
      .to.eql(loadedState)
  })

  it('Adding a new thing completed', () => {
    const postThingDoneReducer = __GetDependency__('postThingDoneReducer')
    const newWithId = {id: newThingId, ...newThing}
    const expectedState = immutable.List([newWithId])
    const action = actions.postThingDone(newWithId)
    const newState = postThingDoneReducer(initialState, action)
    expect(newState.toJS()).to.eql(expectedState.toJS())
  })
})
