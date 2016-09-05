/* eslint-env mocha */

import {expect} from 'chai'
import * as immutable from 'immutable'

import {__GetDependency__} from '../app/reducers/ui'
import * as actions from '../app/actions'
import {createThing} from '../app/models'

const THINGDIALOG_NEW = Symbol.for('ui.THINGDIALOG_NEW')
const THINGDIALOG_EDIT = Symbol.for('ui.THINGDIALOG_EDIT')
const THINGDIALOG_CLOSED = Symbol.for('ui.THINGDIALOG_CLOSED')

describe('UI reducers:', () => {
  it('Creating a new thing', () => {
    const createNewThingReducer = __GetDependency__('createNewThingReducer')
    const testThing = createThing('')
    const action = actions.createNewThing(testThing)
    const oldState = immutable.fromJS({thingDialog: {mode: THINGDIALOG_CLOSED}})
    const expectedState = immutable.Map({thingDialog: {
      mode: THINGDIALOG_NEW, thing: testThing
    }})
    expect(createNewThingReducer(oldState, action).toJS())
      .to.eql(expectedState.toJS())
  })

  it('Editing an exiting thing', () => {
    const editThingReducer = __GetDependency__('editThingReducer')
    const testThing = createThing('TESTTHING')
    const action = actions.editThing(testThing)
    const oldState = immutable.fromJS({thingDialog: {mode: THINGDIALOG_CLOSED}})
    const expectedState = immutable.Map({thingDialog: {
      mode: THINGDIALOG_EDIT, thing: testThing
    }})
    expect(editThingReducer(oldState, action).toJS())
      .to.eql(expectedState.toJS())
  })

  it('Finished working with thing edit dialog', () => {
    const editThingDoneReducer = __GetDependency__('editThingDoneReducer')
    const action = actions.editThingDone()
    const oldState = immutable.fromJS({thingDialog: {mode: THINGDIALOG_EDIT}})
    const expectedState = immutable.Map({thingDialog: {mode: THINGDIALOG_CLOSED}})
    expect(editThingDoneReducer(oldState, action).toJS())
      .to.eql(expectedState.toJS())
  })
})
