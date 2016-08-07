/* eslint-env mocha */

import 'babel-polyfill'
import {expect} from 'chai'
import { createAction } from 'redux-actions'

import * as actions from '../app/actions'
import {__GetDependency__} from '../app/actions' // eslint-disable-line no-duplicate-imports

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

describe('Redux action creators', () => {
  it('Fetch thing list', () => {
    const thingListAction = actions.getThingList()
    // Should be a thunk
    expect(thingListAction).to.be.a('function')
  })

  it('POST a new thing', () => {
    const thingListAction = actions.postThing()
    // Should be a thunk
    expect(thingListAction).to.be.a('function')
  })
})
