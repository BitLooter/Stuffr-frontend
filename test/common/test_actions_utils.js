/* eslint-env mocha */
// Turn off the unused expressions tool, they are used by Chai for testing
/* eslint no-unused-expressions: off */

import { expect } from 'chai'
import 'mocha-sinon'
import { createAction } from 'redux-actions'

import * as actions from '../../app/common/actions'

describe('Actions - Common utils:', () => {
  it('Create API thunk', () => {
    const dummyAction = createAction('DUMMY_ACTION')
    const newThunkCreator = actions.createTaskThunk(
      async () => {},
      dummyAction, dummyAction, dummyAction
    )
    expect(newThunkCreator).to.be.a('function')
    const newThunk = newThunkCreator()
    expect(newThunk).to.be.a('function')
  })
})
