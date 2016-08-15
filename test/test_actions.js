/* eslint-env mocha */

import {expect} from 'chai'
import {createAction} from 'redux-actions'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'

import * as actions from '../app/actions'
import {__GetDependency__} from '../app/actions' // eslint-disable-line no-duplicate-imports
import {StuffrApi} from '../app/stuffrapi'
import {TEST_DOMAIN, testThings, newThing, newThingId} from './dummydata'

const THINGS_URL = `${TEST_DOMAIN}/things`
const mockStore = configureStore([thunk])

describe('Generic action code', () => {
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

describe('API thunk actions', () => {
  let api
  beforeEach(() => {
    api = new StuffrApi(TEST_DOMAIN)
    global.stuffrapi = api
  })
  afterEach(() => {
    api = undefined
    delete global.stuffrapi
    fetchMock.restore()
  })

  it('Fetch thing list', async () => {
    const thingListAction = actions.getThingList()
    // Should be a thunk
    expect(thingListAction).to.be.a('function')

    fetchMock.get(THINGS_URL, testThings)

    const store = mockStore({})
    await store.dispatch(actions.getThingList())
    expect(fetchMock.called(THINGS_URL)).to.be.true
    const thunkActions = store.getActions()
    expect(thunkActions).to.have.length(2)
    expect(thunkActions[0].type).to.equal(actions.GET_THING_LIST__REQUEST)
    expect(thunkActions[1].type).to.equal(actions.GET_THING_LIST__DONE)
    expect(thunkActions[1].payload).to.eql(testThings)
  })

  it('POST a new thing', async () => {
    const thingListAction = actions.postThing()
    // Should be a thunk
    expect(thingListAction).to.be.a('function')

    const newThingResponse = {id: newThingId}
    fetchMock.post(THINGS_URL, {
      status: 201,
      body: newThingResponse
    })

    const store = mockStore({})
    await store.dispatch(actions.postThing(newThing))
    expect(fetchMock.called(THINGS_URL)).to.be.true
    const thunkActions = store.getActions()
    expect(thunkActions).to.have.length(2)
    expect(thunkActions[0].type).to.equal(actions.POST_THING__REQUEST)
    expect(thunkActions[1].type).to.equal(actions.POST_THING__DONE)
    expect(thunkActions[1].payload).to.eql({...newThing, ...newThingResponse})
  })
})
