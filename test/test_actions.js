/* eslint-env mocha */

import {expect} from 'chai'
import 'mocha-sinon'
import {createAction} from 'redux-actions'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actions from '../app/actions'
import {__GetDependency__} from '../app/actions' // eslint-disable-line no-duplicate-imports
import stuffrApi, {setupApi} from '../app/stuffrapi'
import {TEST_DOMAIN, TEST_AUTH_URL, TEST_STORE, TEST_USER, TEST_INVENTORIES, TEST_THINGS,
        NEW_INVENTORY, NEW_INVENTORY_ID, NEW_THING, NEW_THING_ID, NEW_USER} from './dummydata'

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
      setupApi(TEST_DOMAIN, TEST_AUTH_URL)
    })

    it('Logging in a user (loginUser)', async function () {
      const loginUserAction = actions.loginUser('testmail@example.com', 'pass')
      // Should be a thunk
      expect(loginUserAction).to.be.a('function')

      const store = mockStore(TEST_STORE)
      this.sinon.stub(stuffrApi, 'login')

      global.window = {localStorage: {}}
      await store.dispatch(loginUserAction)
      expect(stuffrApi.login.calledOnce).to.be.true

      const thunkActions = store.getActions()
      const actionTypes = thunkActions.map((a) => a.type)
      expect(actionTypes).to.include(actions.LOGIN_USER__DONE)
      // These actions may not complete before thunk is finished, check they
      // were started instead.
      expect(actionTypes).to.include(actions.LOAD_USER__REQUEST)

      const state = store.getState()
      expect(state.database.user).to.eql(TEST_USER)
      expect(state.database.inventories).to.eql(TEST_INVENTORIES)

      expect(global.window.localStorage.apiToken).to.not.be.undefined
    })

    it('Logging in a user with incorrect password', async function () {
      const loginUserAction = actions.loginUser('testmail@example.com', 'badpass')
      // Should be a thunk
      expect(loginUserAction).to.be.a('function')

      const store = mockStore(TEST_STORE)
      this.sinon.stub(stuffrApi, 'login').throws('An error')

      await store.dispatch(loginUserAction)
      expect(stuffrApi.login.calledOnce).to.be.true

      const thunkActions = store.getActions()
      const actionTypes = thunkActions.map((a) => a.type)
      expect(actionTypes).to.include(actions.LOGIN_USER__ERROR)
    })

    it('Logging a user out (logoutUser)', async function () {
      const logoutUserAction = actions.logoutUser()
      // Should be a thunk
      expect(logoutUserAction).to.be.a('function')

      const store = mockStore(TEST_STORE)
      this.sinon.stub(stuffrApi, 'logout')

      await store.dispatch(logoutUserAction)
      expect(stuffrApi.logout.calledOnce).to.be.true

      const thunkActions = store.getActions()
      const actionTypes = thunkActions.map((a) => a.type)
      expect(actionTypes).to.include(actions.PURGE_USER)

      expect(stuffrApi.token).to.be.null
    })

    it('Registering a new user (registerUser)', async function () {
      const registerUserAction = actions.registerUser(NEW_USER)
      // Should be a thunk
      expect(registerUserAction).to.be.a('function')

      const store = mockStore(TEST_STORE)
      this.sinon.stub(stuffrApi, 'registerUser')

      global.window = {localStorage: {}}
      await store.dispatch(registerUserAction)
      expect(stuffrApi.registerUser.calledOnce).to.be.true

      const thunkActions = store.getActions()
      const actionTypes = thunkActions.map((a) => a.type)
      expect(actionTypes).to.include(actions.REGISTER_USER__DONE)
      // These actions may not complete before thunk is finished, check they
      // were started instead.
      expect(actionTypes).to.include(actions.LOAD_USER__REQUEST)

      const state = store.getState()
      expect(state.database.user).to.eql(TEST_USER)
      expect(state.database.inventories).to.eql(TEST_INVENTORIES)

      expect(global.window.localStorage.apiToken).to.not.be.undefined
    })

    it('Registering a new user with invalid data', async function () {
      const registerUserAction = actions.registerUser('testmail@example.com', 'badpass')
      // Should be a thunk
      expect(registerUserAction).to.be.a('function')

      const store = mockStore(TEST_STORE)
      this.sinon.stub(stuffrApi, 'registerUser').throws('An error')

      await store.dispatch(registerUserAction)
      expect(stuffrApi.registerUser.calledOnce).to.be.true

      const thunkActions = store.getActions()
      const actionTypes = thunkActions.map((a) => a.type)
      expect(actionTypes).to.include(actions.REGISTER_USER__ERROR)
    })

    it('Loading a user (loadUser)', async function () {
      const loadUserAction = actions.loadUser()
      // Should be a thunk
      expect(loadUserAction).to.be.a('function')

      const store = mockStore(TEST_STORE)
      this.sinon.stub(stuffrApi, 'getUserInfo').returns(TEST_USER)
      this.sinon.stub(stuffrApi, 'getInventories').returns(TEST_INVENTORIES)

      await store.dispatch(loadUserAction)
      expect(stuffrApi.getUserInfo.calledOnce).to.be.true
      expect(stuffrApi.getInventories.calledOnce).to.be.true

      const thunkActions = store.getActions()
      const actionTypes = thunkActions.map((a) => a.type)
      expect(actionTypes).to.include(actions.api.GET_INVENTORY_LIST__DONE)
      expect(actionTypes).to.include(actions.ui.SET_CURRENT_INVENTORY)
      expect(actionTypes).to.include(actions.LOAD_USER__DONE)
      // These actions may not complete before thunk is finished, check they
      // were started instead.
      expect(actionTypes).to.include(actions.LOAD_INVENTORY__REQUEST)

      const state = store.getState()
      expect(state.database.user).to.eql(TEST_USER)
      expect(state.database.inventories).to.eql(TEST_INVENTORIES)
    })

    it('Load an inventory (loadInventory)', async function () {
      const loadInventoryAction = actions.loadInventory(0)
      // Should be a thunk
      expect(loadInventoryAction).to.be.a('function')

      const store = mockStore(TEST_STORE)

      await store.dispatch(loadInventoryAction)
      const thunkActions = store.getActions()
      const actionTypes = thunkActions.map((a) => a.type)
      expect(actionTypes).to.include(actions.ui.SET_CURRENT_INVENTORY)
      expect(actionTypes).to.include(actions.LOAD_INVENTORY__DONE)
    })

    it('Load an invalid inventory', async function () {
      const invalidIndex = TEST_STORE.database.inventories.length
      const loadInventoryAction = actions.loadInventory(invalidIndex)
      // Should be a thunk
      expect(loadInventoryAction).to.be.a('function')

      const store = mockStore(TEST_STORE)

      await store.dispatch(loadInventoryAction)
      const thunkActions = store.getActions()
      const actionTypes = thunkActions.map((a) => a.type)
      expect(actionTypes).to.include(actions.LOAD_INVENTORY__ERROR)
    })
  })

  describe('API thunk actions:', function () {
    beforeEach(() => {
      setupApi(TEST_DOMAIN, TEST_AUTH_URL)
    })

    it('GET user info', async function () {
      // TODO: Test errors
      const userInfoAction = actions.api.getUserInfo()
      // Should be a thunk
      expect(userInfoAction).to.be.a('function')

      this.sinon.stub(stuffrApi, 'getUserInfo').returns(TEST_USER)
      const store = mockStore({})

      await store.dispatch(userInfoAction)
      expect(stuffrApi.getUserInfo.calledOnce).to.be.true
      const thunkActions = store.getActions()
      expect(thunkActions).to.have.length(2)
      expect(thunkActions[0].type).to.equal(actions.api.GET_USER_INFO__REQUEST)
      expect(thunkActions[1].type).to.equal(actions.api.GET_USER_INFO__DONE)
      expect(thunkActions[1].payload).to.eql(TEST_USER)
    })

    it('GET inventory list', async function () {
      // TODO: Test errors
      const inventoryListAction = actions.api.getInventoryList()
      // Should be a thunk
      expect(inventoryListAction).to.be.a('function')

      this.sinon.stub(stuffrApi, 'getInventories').returns(TEST_INVENTORIES)
      const store = mockStore({})

      await store.dispatch(inventoryListAction)
      expect(stuffrApi.getInventories.calledOnce).to.be.true
      const thunkActions = store.getActions()
      expect(thunkActions).to.have.length(2)
      expect(thunkActions[0].type).to.equal(actions.api.GET_INVENTORY_LIST__REQUEST)
      expect(thunkActions[1].type).to.equal(actions.api.GET_INVENTORY_LIST__DONE)
      expect(thunkActions[1].payload).to.eql(TEST_INVENTORIES)
    })

    it('POST a new inventory', async function () {
      const inventoryListAction = actions.api.postInventory(NEW_INVENTORY)
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
      expect(thunkActions[0].type).to.equal(actions.api.POST_INVENTORY__REQUEST)
      expect(thunkActions[1].type).to.equal(actions.api.POST_INVENTORY__DONE)
      expect(thunkActions[1].payload).to.eql({...NEW_INVENTORY, ...newInventoryResponse})
    })

    it('GET thing list', async function () {
      // TODO: Test errors
      const thingListAction = actions.api.getThingList()
      // Should be a thunk
      expect(thingListAction).to.be.a('function')

      this.sinon.stub(stuffrApi, 'getThings').returns(TEST_THINGS)
      const store = mockStore({})

      await store.dispatch(thingListAction)
      expect(stuffrApi.getThings.calledOnce).to.be.true
      const thunkActions = store.getActions()
      expect(thunkActions).to.have.length(2)
      expect(thunkActions[0].type).to.equal(actions.api.GET_THING_LIST__REQUEST)
      expect(thunkActions[1].type).to.equal(actions.api.GET_THING_LIST__DONE)
      expect(thunkActions[1].payload).to.eql(TEST_THINGS)
    })

    it('POST a new thing', async function () {
      const thingListAction = actions.api.postThing(TEST_INVENTORIES[0].id, NEW_THING)
      // Should be a thunk
      expect(thingListAction).to.be.a('function')

      const newThingResponse = {id: NEW_THING_ID}
      const addThingStub = this.sinon.stub(stuffrApi, 'addThing')
      addThingStub.returns(newThingResponse)
      const store = mockStore({})

      await store.dispatch(thingListAction)
      // TODO: update this test once multiple inventories are implemented
      expect(stuffrApi.addThing.calledWith(TEST_INVENTORIES[0].id, NEW_THING)).to.be.true
      const thunkActions = store.getActions()
      expect(thunkActions).to.have.length(2)
      expect(thunkActions[0].type).to.equal(actions.api.POST_THING__REQUEST)
      expect(thunkActions[1].type).to.equal(actions.api.POST_THING__DONE)
      expect(thunkActions[1].payload).to.eql({...NEW_THING, ...newThingResponse})
    })

    it('Update (PUT) an existing thing', async function () {
      const updateThingId = TEST_THINGS[0].id
      const updateData = {name: 'UPDATE'}
      const updateThingAction = actions.api.updateThing(updateThingId, updateData)
      // Should be a thunk
      expect(updateThingAction).to.be.a('function')

      this.sinon.stub(stuffrApi, 'updateThing')
      const store = mockStore(TEST_THINGS)

      await store.dispatch(updateThingAction)
      expect(stuffrApi.updateThing.calledWith(updateThingId)).to.be.true
      const thunkActions = store.getActions()
      expect(thunkActions).to.have.length(2)
      expect(thunkActions[0].type).to.equal(actions.api.UPDATE_THING__REQUEST)
      expect(thunkActions[1].type).to.equal(actions.api.UPDATE_THING__DONE)
      expect(thunkActions[1].payload).to.eql({id: updateThingId, update: updateData})
    })

    it('DELETE a thing', async function () {
      const deleteThingId = TEST_THINGS[0].id
      const deleteAction = actions.api.deleteThing(deleteThingId)
      // Should be a thunk
      expect(deleteAction).to.be.a('function')

      this.sinon.stub(stuffrApi, 'deleteThing')
      const store = mockStore(TEST_THINGS)

      await store.dispatch(deleteAction)
      expect(stuffrApi.deleteThing.calledWith(deleteThingId)).to.be.true
      const thunkActions = store.getActions()
      expect(thunkActions).to.have.length(2)
      expect(thunkActions[0].type).to.equal(actions.api.DELETE_THING__REQUEST)
      expect(thunkActions[1].type).to.equal(actions.api.DELETE_THING__DONE)
    })
  })
})
