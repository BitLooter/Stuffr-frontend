/* eslint-env mocha */

import 'babel-polyfill'
import {expect} from 'chai'
import * as actions from '../app/actions'

describe('Redux action creators', () => {
  it('Fetch thing list', () => {
    const thingListAction = actions.fetchThingList()
    // Should be a thunk
    expect(thingListAction).to.be.a('function')
  })
})
