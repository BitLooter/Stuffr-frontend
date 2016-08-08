/* eslint-env mocha */

import 'babel-polyfill'
import 'isomorphic-fetch'
import {expect} from 'chai'
import { createAction } from 'redux-actions'
import nock from 'nock'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actions from '../app/actions'
import {__GetDependency__} from '../app/actions' // eslint-disable-line no-duplicate-imports
import { StuffrApi } from '../app/stuffrapi'

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
  it('Fetch thing list', async () => {
    const thingListAction = actions.getThingList()
    // Should be a thunk
    expect(thingListAction).to.be.a('function')

    const testThings = [
      {id: 1, name: 'THING1'},
      {id: 2, name: 'THING2'}
    ]
    const nockScope = nock('https://example.com')
      .get('/things')
      .reply(200, testThings)
    const api = new StuffrApi('https://example.com')
    global.stuffrapi = api

    const store = mockStore({})
    await store.dispatch(actions.getThingList())
    const thunkActions = store.getActions()
    expect(thunkActions).to.have.length(2)
    expect(thunkActions[0].type).to.equal(actions.GET_THING_LIST__REQUEST)
    expect(thunkActions[1].type).to.equal(actions.GET_THING_LIST__DONE)
    expect(thunkActions[1].payload).to.eql(testThings)
    nockScope.done()
  })

  it('POST a new thing', async () => {
    const thingListAction = actions.postThing()
    // Should be a thunk
    expect(thingListAction).to.be.a('function')

    const newThing = {name: 'NEWTHING'}
    const newThingResponse = {id: 999}
    const nockScope = nock('https://example.com')
      .post('/things', newThing)
      .reply(201, newThingResponse)
    const api = new StuffrApi('https://example.com')
    global.stuffrapi = api

    const store = mockStore({})
    await store.dispatch(actions.postThing(newThing))
    const thunkActions = store.getActions()
    expect(thunkActions).to.have.length(2)
    expect(thunkActions[0].type).to.equal(actions.POST_THING__REQUEST)
    expect(thunkActions[1].type).to.equal(actions.POST_THING__DONE)
    expect(thunkActions[1].payload).to.eql({...newThing, ...newThingResponse})
    nockScope.done()
  })
})
