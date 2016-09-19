/* eslint-env mocha */

import {expect} from 'chai'
import 'mocha-sinon'
import {createAction} from 'redux-actions'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actions from '../app/actions'
import {__GetDependency__} from '../app/actions' // eslint-disable-line no-duplicate-imports
import stuffrApi, {setupApi} from '../app/stuffrapi'
import {TEST_DOMAIN, TEST_THINGS, NEW_THING, NEW_THING_ID} from './dummydata'

const mockStore = configureStore([thunk])

describe('Generic action code:', () => {
  it('Create API thunk', () => {
    const createApiThunk = __GetDependency__('createApiThunk')
    const dummyAction = createAction('DUMMY_ACTION')
    const newThunkCreator = createApiThunk(
      async () => {},
      dummyAction, dummyAction, dummyAction
    )
    expect(newThunkCreator).to.be.a('function')
    const newThunk = newThunkCreator()
    expect(newThunk).to.be.a('function')
  })
})

describe('API thunk actions:', function () {
  beforeEach(() => {
    setupApi(TEST_DOMAIN)
  })

  it('GET thing list', async function () {
    // TODO: Test errors
    const thingListAction = actions.getThingList()
    // Should be a thunk
    expect(thingListAction).to.be.a('function')

    const getThingsStub = this.sinon.stub(stuffrApi, 'getThings')
    getThingsStub.returns(TEST_THINGS)
    const store = mockStore({})

    await store.dispatch(actions.getThingList())
    expect(stuffrApi.getThings.calledOnce).to.be.true
    const thunkActions = store.getActions()
    expect(thunkActions).to.have.length(2)
    expect(thunkActions[0].type).to.equal(actions.GET_THING_LIST__REQUEST)
    expect(thunkActions[1].type).to.equal(actions.GET_THING_LIST__DONE)
    expect(thunkActions[1].payload).to.eql(TEST_THINGS)
  })

  it('POST a new thing', async function () {
    const thingListAction = actions.postThing()
    // Should be a thunk
    expect(thingListAction).to.be.a('function')

    const newThingResponse = {id: NEW_THING_ID}
    const addThingStub = this.sinon.stub(stuffrApi, 'addThing')
    addThingStub.returns(newThingResponse)
    const store = mockStore({})

    await store.dispatch(actions.postThing(NEW_THING))
    expect(stuffrApi.addThing.calledWith(NEW_THING)).to.be.true
    const thunkActions = store.getActions()
    expect(thunkActions).to.have.length(2)
    expect(thunkActions[0].type).to.equal(actions.POST_THING__REQUEST)
    expect(thunkActions[1].type).to.equal(actions.POST_THING__DONE)
    expect(thunkActions[1].payload).to.eql({...NEW_THING, ...newThingResponse})
  })

  it('Update (PUT) an existing thing', async function () {
    const updateThingAction = actions.updateThing()
    // Should be a thunk
    expect(updateThingAction).to.be.a('function')

    const updateThingId = TEST_THINGS[0].id
    const updateData = {name: 'UPDATE'}
    this.sinon.stub(stuffrApi, 'updateThing')
    const store = mockStore(TEST_THINGS)

    await store.dispatch(actions.updateThing(updateThingId, updateData))
    expect(stuffrApi.updateThing.calledWith(updateThingId)).to.be.true
    const thunkActions = store.getActions()
    expect(thunkActions).to.have.length(2)
    expect(thunkActions[0].type).to.equal(actions.UPDATE_THING__REQUEST)
    expect(thunkActions[1].type).to.equal(actions.UPDATE_THING__DONE)
    expect(thunkActions[1].payload).to.eql({id: updateThingId, update: updateData})
  })

  it('Delete a thing', async function () {
    const deleteAction = actions.deleteThing()
    // Should be a thunk
    expect(deleteAction).to.be.a('function')

    const deleteThingId = TEST_THINGS[0].id
    this.sinon.stub(stuffrApi, 'deleteThing')
    const store = mockStore(TEST_THINGS)

    await store.dispatch(actions.deleteThing(deleteThingId))
    expect(stuffrApi.deleteThing.calledWith(deleteThingId)).to.be.true
    const thunkActions = store.getActions()
    expect(thunkActions).to.have.length(2)
    expect(thunkActions[0].type).to.equal(actions.DELETE_THING__REQUEST)
    expect(thunkActions[1].type).to.equal(actions.DELETE_THING__DONE)
  })
})
