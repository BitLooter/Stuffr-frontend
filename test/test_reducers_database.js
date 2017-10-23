/* eslint-env mocha */
// Turn off the unused expressions tool, they are used by Chai for testing
/* eslint no-unused-expressions: off */
// TODO: Test error conditions

import { expect } from 'chai'
import log from 'loglevel'
import 'mocha-sinon'
import Immutable from 'seamless-immutable'

import { TEST_THINGS, NEW_THING, NEW_THING_ID,
  NEW_INVENTORY, NEW_INVENTORY_ID } from './dummydata'
import { __GetDependency__ } from '../app/main/reducers/database'
import * as actions from '../app/main/actions'
import * as actionsAuth from '../app/common/actions/auth'

const initialState = Immutable({user: null, inventories: [], things: []})

describe('Reducers - Errors:', () => {
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

describe('Reducers - Database:', () => {
  it('Get all things completed', () => {
    const getThingsDoneReducer = __GetDependency__('getThingsDoneReducer')
    const action = actions.api.getThingsDone(TEST_THINGS.asMutable())
    const expectedState = Immutable({user: null, inventories: [], things: TEST_THINGS})
    expect(getThingsDoneReducer(initialState, action)).to.eql(expectedState)
  })

  it('Adding a new thing completed', () => {
    const postThingDoneReducer = __GetDependency__('postThingDoneReducer')
    const newWithId = {id: NEW_THING_ID, ...NEW_THING}
    const expectedState = Immutable({user: null, inventories: [], things: [newWithId]})
    const action = actions.api.postThingDone(newWithId)
    const newState = postThingDoneReducer(initialState, action)
    expect(newState).to.eql(expectedState)
  })

  it('Updating an existing thing completed', () => {
    const putThingDoneReducer = __GetDependency__('putThingDoneReducer')
    const updateData = {name: 'UPDATED'}
    let expectedState = TEST_THINGS.asMutable({deep: true})
    expectedState[0].name = 'UPDATED'
    expectedState = Immutable({user: null, inventories: [], things: expectedState})
    const action = actions.api.putThingDone({id: TEST_THINGS[0].id, update: updateData})
    const newState = putThingDoneReducer(Immutable({user: null, inventories: [], things: TEST_THINGS}), action)
    expect(newState).to.eql(expectedState)
  })

  it('Deleting a thing completed', () => {
    const deleteThingDoneReducer = __GetDependency__('deleteThingDoneReducer')
    const deleteThingId = TEST_THINGS[0].id
    const expectedState = Immutable({user: null, inventories: [], things: [TEST_THINGS[1]]})
    const action = actions.api.deleteThingDone(deleteThingId)
    const newState = deleteThingDoneReducer(Immutable({user: null, inventories: [], things: TEST_THINGS}), action)
    expect(newState).to.eql(expectedState)
  })

  it('Adding a new inventory completed', () => {
    const createInventoryDoneReducer = __GetDependency__('createInventoryDoneReducer')
    const newWithId = {id: NEW_INVENTORY_ID, ...NEW_INVENTORY}
    const expectedState = initialState.set('inventories', [newWithId])
    const action = actions.api.postInventoryDone(newWithId)
    const newState = createInventoryDoneReducer(initialState, action)
    expect(newState).to.eql(expectedState)
  })

  it('Purging user data', () => {
    const purgeUserReducer = __GetDependency__('purgeUserReducer')
    const action = actionsAuth.purgeUser()
    const newState = purgeUserReducer(initialState, action)
    expect(newState.things).to.be.empty
    expect(newState.inventories).to.be.empty
    expect(newState.user).to.be.null
  })
})
