/* eslint-env mocha */
// Turn off the unused expressions tool, they are used by Chai for testing
/* eslint no-unused-expressions: off */

import {expect} from 'chai'
import Immutable from 'seamless-immutable'

import {__GetDependency__} from '../../app/common/reducers/auth'
import * as actions from '../../app/common/actions/auth'

describe('Reducers - Authentication:', () => {
  it('Backend error logging in user', () => {
    const loginErrorReducer = __GetDependency__('loginErrorReducer')
    const action = actions.loginUserError({message: 'ERROR'})
    const oldState = Immutable({loginError: undefined})
    const newState = loginErrorReducer(oldState, action)
    expect(newState.loginError).to.equal('ERROR')
  })

  it('Backend error registering new user', () => {
    const registerErrorReducer = __GetDependency__('registerErrorReducer')
    const action = actions.registerUserError({message: 'ERROR'})
    const oldState = Immutable({registerError: undefined})
    const newState = registerErrorReducer(oldState, action)
    expect(newState.registerError).to.equal('ERROR')
  })

  it('Log user out', () => {
    const purgeUserReducer = __GetDependency__('purgeUserReducer')
    const action = actions.purgeUser()
    const oldState = Immutable({authenticated: true})
    const newState = purgeUserReducer(oldState, action)
    expect(newState.authenticated).to.be.false
  })
})
