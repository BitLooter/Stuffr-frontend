/* eslint-env mocha */
// Turn off the unused expressions tool, they are used by Chai for testing
/* eslint no-unused-expressions: off */

import { expect } from 'chai'
import 'mocha-sinon'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actions from '../../app/common/actions/auth'
import stuffrApi, {setupApi} from '../../app/stuffrapi'
import { TEST_DOMAIN, TEST_AUTH_URL, TEST_STORE, TEST_USER,
  NEW_USER } from '../dummydata'

const mockStore = configureStore([thunk])

describe('Actions - Authentication:', () => {
  beforeEach(() => {
    setupApi(TEST_DOMAIN, TEST_AUTH_URL)
  })

  it('Logging in a user (loginUser)', async function () {
    const loginUserAction = actions.loginUser('testmail@example.com', 'pass')
    // Should be a thunk
    expect(loginUserAction).to.be.a('function')

    const store = mockStore(TEST_STORE)
    this.sinon.stub(stuffrApi, 'login')

    global.localStorage = {}
    await store.dispatch(loginUserAction)
    expect(stuffrApi.login.calledOnce).to.be.true

    const thunkActions = store.getActions()
    const actionTypes = thunkActions.map((a) => a.type)
    expect(actionTypes).to.include(actions.LOGIN_USER__FINISH)

    const state = store.getState()
    expect(state.database.user).to.eql(TEST_USER)

    expect(global.localStorage.apiToken).to.not.be.undefined
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

    global.localStorage = {}
    await store.dispatch(registerUserAction)
    expect(stuffrApi.registerUser.calledOnce).to.be.true

    const thunkActions = store.getActions()
    const actionTypes = thunkActions.map((a) => a.type)
    expect(actionTypes).to.include(actions.REGISTER_USER__FINISH)

    const state = store.getState()
    expect(state.database.user).to.eql(TEST_USER)

    expect(global.localStorage.apiToken).to.not.be.undefined
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
})
