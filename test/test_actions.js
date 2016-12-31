/* eslint-env mocha */

import {expect} from 'chai'
import 'mocha-sinon'
import {createAction} from 'redux-actions'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actions from '../app/actions'
import {__GetDependency__} from '../app/actions' // eslint-disable-line no-duplicate-imports
import stuffrApi, {setupApi} from '../app/stuffrapi'
import {TEST_DOMAIN, TEST_STORE, TEST_USER, TEST_INVENTORIES, TEST_THINGS,
        NEW_INVENTORY, NEW_INVENTORY_ID, NEW_THING, NEW_THING_ID} from './dummydata'

const mockStore = configureStore([thunk])

describe('Actions:', () => {
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

  describe('Task actions', function () {
    beforeEach(() => {
      setupApi(TEST_DOMAIN)
    })

    it('Logging in a user (loginUser)', async function () {
      const loginUserAction = actions.loginUser('testmail@example.com', 'pass')
      // Should be a thunk
      expect(loginUserAction).to.be.a('function')

      const store = mockStore(TEST_STORE)
      this.sinon.stub(stuffrApi, 'login')
      this.sinon.stub(stuffrApi, 'getUserInfo').returns(TEST_USER)
      this.sinon.stub(stuffrApi, 'getInventories').returns(TEST_INVENTORIES)

      await store.dispatch(loginUserAction)
      expect(stuffrApi.login.calledOnce).to.be.true
      expect(stuffrApi.getUserInfo.calledOnce).to.be.true
      expect(stuffrApi.getInventories.calledOnce).to.be.true
      const thunkActions = store.getActions()
      expect(thunkActions).to.have.length(5)
      expect(thunkActions[0].type).to.equal(actions.LOGIN_USER__REQUEST)
      expect(thunkActions[1].type).to.equal(actions.GET_INVENTORY_LIST__REQUEST)
      expect(thunkActions[2].type).to.equal(actions.GET_INVENTORY_LIST__DONE)
      expect(thunkActions[3].type).to.equal(actions.GET_THING_LIST__REQUEST)
      // GET_THING_LIST is dispatched at the end of login, will not complete
      // before action ends
      expect(thunkActions[4].type).to.equal(actions.LOGIN_USER__DONE)
      const state = store.getState()
      expect(state.database.user).to.eql(TEST_USER)
      expect(state.database.inventories).to.eql(TEST_INVENTORIES)
    })

    it('Logging in a user with incorrect password', async function () {
      const loginUserAction = actions.loginUser('testmail@example.com', 'badpass')
      // Should be a thunk
      expect(loginUserAction).to.be.a('function')

      const store = mockStore(TEST_STORE)
      // TODO: Figure out how to get a stub for login to raise an error
      this.sinon.stub(stuffrApi, 'login').throws('Any error')

      await store.dispatch(loginUserAction)
      const thunkActions = store.getActions()
      expect(thunkActions).to.have.length(2)
      expect(thunkActions[0].type).to.equal(actions.LOGIN_USER__REQUEST)
      expect(thunkActions[1].type).to.equal(actions.LOGIN_USER__ERROR)
    })
  })

  describe('API thunk actions:', function () {
    beforeEach(() => {
      setupApi(TEST_DOMAIN)
    })

    it('GET inventory list', async function () {
      // TODO: Test errors
      const inventoryListAction = actions.getInventoryList()
      // Should be a thunk
      expect(inventoryListAction).to.be.a('function')

      this.sinon.stub(stuffrApi, 'getInventories').returns(TEST_INVENTORIES)
      const store = mockStore({})

      await store.dispatch(inventoryListAction)
      expect(stuffrApi.getInventories.calledOnce).to.be.true
      const thunkActions = store.getActions()
      expect(thunkActions).to.have.length(2)
      expect(thunkActions[0].type).to.equal(actions.GET_INVENTORY_LIST__REQUEST)
      expect(thunkActions[1].type).to.equal(actions.GET_INVENTORY_LIST__DONE)
      expect(thunkActions[1].payload).to.eql(TEST_INVENTORIES)
    })

    it('POST a new inventory', async function () {
      const inventoryListAction = actions.postInventory(NEW_INVENTORY)
      // Should be a thunk
      expect(inventoryListAction).to.be.a('function')

      const newInventoryResponse = {id: NEW_INVENTORY_ID}
      const addInventoryStub = this.sinon.stub(stuffrApi, 'addInventory')
      addInventoryStub.returns(newInventoryResponse)
      const store = mockStore({})

      await store.dispatch(inventoryListAction)
      // TODO: update this test once multiple inventories are implemented
      expect(stuffrApi.addInventory.calledWith(NEW_INVENTORY)).to.be.true
      const thunkActions = store.getActions()
      expect(thunkActions).to.have.length(2)
      expect(thunkActions[0].type).to.equal(actions.POST_INVENTORY__REQUEST)
      expect(thunkActions[1].type).to.equal(actions.POST_INVENTORY__DONE)
      expect(thunkActions[1].payload).to.eql({...NEW_INVENTORY, ...newInventoryResponse})
    })

    it('GET thing list', async function () {
      // TODO: Test errors
      const thingListAction = actions.getThingList()
      // Should be a thunk
      expect(thingListAction).to.be.a('function')

      this.sinon.stub(stuffrApi, 'getThings').returns(TEST_THINGS)
      const store = mockStore({})

      await store.dispatch(thingListAction)
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

      await store.dispatch(actions.postThing(TEST_INVENTORIES[0].id, NEW_THING))
      // TODO: update this test once multiple inventories are implemented
      expect(stuffrApi.addThing.calledWith(TEST_INVENTORIES[0].id, NEW_THING)).to.be.true
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
})
