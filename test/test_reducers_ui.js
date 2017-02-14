/* eslint-env mocha */

import {expect} from 'chai'
import Immutable from 'seamless-immutable'

import {__GetDependency__} from '../app/reducers/ui'
import * as actions from '../app/actions'
import {createThing, createInventory} from '../app/models'

const DIALOG_NEW = Symbol.for('ui.DIALOG_NEW')
const DIALOG_EDIT = Symbol.for('ui.DIALOG_EDIT')
const DIALOG_CLOSED = Symbol.for('ui.DIALOG_CLOSED')

describe('Reducers - UI:', () => {
  it('Creating a new thing', () => {
    const createNewThingReducer = __GetDependency__('createNewThingReducer')
    const testThing = createThing('')
    const action = actions.ui.createNewThing(testThing)
    const oldState = Immutable({thingDialog: {mode: DIALOG_CLOSED}})
    const expectedState = Immutable({thingDialog: {
      mode: DIALOG_NEW, thing: testThing
    }})
    expect(createNewThingReducer(oldState, action)).to.eql(expectedState)
  })

  it('Editing an existing thing', () => {
    const editThingReducer = __GetDependency__('editThingReducer')
    const testThing = createThing('TESTTHING')
    const action = actions.ui.editThing(testThing)
    const oldState = Immutable({thingDialog: {mode: DIALOG_CLOSED}})
    const expectedState = Immutable({thingDialog: {
      mode: DIALOG_EDIT, thing: testThing
    }})
    expect(editThingReducer(oldState, action)).to.eql(expectedState)
  })

  it('Finished working with thing edit dialog', () => {
    const editThingDoneReducer = __GetDependency__('editThingDoneReducer')
    const action = actions.ui.editThingDone()
    const oldState = Immutable({thingDialog: {mode: DIALOG_EDIT}})
    const expectedState = Immutable({thingDialog: {mode: DIALOG_CLOSED}})
    expect(editThingDoneReducer(oldState, action)).to.eql(expectedState)
  })

  it('Creating a new inventory', () => {
    const createNewInventoryReducer = __GetDependency__('createNewInventoryReducer')
    const testInventory = createInventory('')
    const action = actions.ui.createNewInventory(testInventory)
    const oldState = Immutable({inventoryDialog: {mode: DIALOG_CLOSED}})
    const expectedState = Immutable({inventoryDialog: {
      mode: DIALOG_NEW, inventory: testInventory
    }})
    expect(createNewInventoryReducer(oldState, action)).to.eql(expectedState)
  })

  it('Editing an existing inventory', () => {
    const editInventoryReducer = __GetDependency__('editInventoryReducer')
    const testInventory = createInventory('TESTINVENTORY')
    const action = actions.ui.editInventory(testInventory)
    const oldState = Immutable({inventoryDialog: {mode: DIALOG_CLOSED}})
    const expectedState = Immutable({inventoryDialog: {
      mode: DIALOG_EDIT, inventory: testInventory
    }})
    expect(editInventoryReducer(oldState, action)).to.eql(expectedState)
  })

  it('Finished working with inventory edit dialog', () => {
    const editInventoryDoneReducer = __GetDependency__('editInventoryDoneReducer')
    const action = actions.ui.editInventoryDone()
    const oldState = Immutable({inventoryDialog: {mode: DIALOG_EDIT}})
    const expectedState = Immutable({inventoryDialog: {mode: DIALOG_CLOSED}})
    expect(editInventoryDoneReducer(oldState, action)).to.eql(expectedState)
  })

  it('Purge user data', () => {
    const purgeUserReducer = __GetDependency__('purgeUserReducer')
    const action = actions.purgeUser()
    const oldState = Immutable({authenticated: true, currentInventory: 6})
    const newState = purgeUserReducer(oldState, action)
    expect(newState.authenticated).to.be.false
    expect(newState.currentInventory).to.be.null
  })
})
