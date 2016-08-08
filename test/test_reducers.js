/* eslint-env mocha */

import 'babel-polyfill'
import {expect} from 'chai'
import * as immutable from 'immutable'
// import sinon from 'sinon'
import mochaSinon from 'mocha-sinon'
mochaSinon()

import {__GetDependency__} from '../app/reducers/things'
const genericErrorReducer = __GetDependency__('genericErrorReducer')

const initialState = immutable.Map({things: []})

describe('Reducers', () => {
  it('Generic error', async function () {
    const errorMessage = 'Unit test error'
    const errorAction = {type: 'DUMMY_ERROR', payload: errorMessage}
    this.sinon.stub(console, 'error')
    expect(genericErrorReducer(initialState, errorAction))
      .to.equal(initialState)
    expect(console.error.calledOnce).to.be.true
    expect(console.error.calledWith(errorMessage)).to.be.true
  })
})
