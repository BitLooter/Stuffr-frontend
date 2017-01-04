/* eslint-env mocha */

import {expect} from 'chai'
import Immutable from 'seamless-immutable'

import {__GetDependency__} from '../app/reducers/ui'
import * as actions from '../app/actions'
import {createThing, createInventory} from '../app/models'

const THINGDIALOG_NEW = Symbol.for('ui.THINGDIALOG_NEW')
const THINGDIALOG_EDIT = Symbol.for('ui.THINGDIALOG_EDIT')
const THINGDIALOG_CLOSED = Symbol.for('ui.THINGDIALOG_CLOSED')
const INVENTORYDIALOG_NEW = Symbol.for('ui.INVENTORYDIALOG_NEW')
const INVENTORYDIALOG_EDIT = Symbol.for('ui.INVENTORYDIALOG_EDIT')
const INVENTORYDIALOG_CLOSED = Symbol.for('ui.INVENTORYDIALOG_CLOSED')

describe('Reducers - UI:', () => {
  it('Creating a new thing', () => {
    const createNewThingReducer = __GetDependency__('createNewThingReducer')
    const testThing = createThing('')
    const action = actions.ui.createNewThing(testThing)
    const oldState = Immutable({thingDialog: {mode: THINGDIALOG_CLOSED}})
    const expectedState = Immutable({thingDialog: {
      mode: THINGDIALOG_NEW, thing: testThing
    }})
    expect(createNewThingReducer(oldState, action)).to.eql(expectedState)
  })

  it('Editing an existing thing', () => {
    const editThingReducer = __GetDependency__('editThingReducer')
    const testThing = createThing('TESTTHING')
    const action = actions.ui.editThing(testThing)
    const oldState = Immutable({thingDialog: {mode: THINGDIALOG_CLOSED}})
    const expectedState = Immutable({thingDialog: {
      mode: THINGDIALOG_EDIT, thing: testThing
    }})
    expect(editThingReducer(oldState, action)).to.eql(expectedState)
  })

  it('Finished working with thing edit dialog', () => {
    const editThingDoneReducer = __GetDependency__('editThingDoneReducer')
    const action = actions.ui.editThingDone()
    const oldState = Immutable({thingDialog: {mode: THINGDIALOG_EDIT}})
    const expectedState = Immutable({thingDialog: {mode: THINGDIALOG_CLOSED}})
    expect(editThingDoneReducer(oldState, action)).to.eql(expectedState)
  })

  it('Creating a new inventory', () => {
    const createNewInventoryReducer = __GetDependency__('createNewInventoryReducer')
    const testInventory = createInventory('')
    const action = actions.ui.createNewInventory(testInventory)
    const oldState = Immutable({inventoryDialog: {mode: INVENTORYDIALOG_CLOSED}})
    const expectedState = Immutable({inventoryDialog: {
      mode: INVENTORYDIALOG_NEW, inventory: testInventory
    }})
    expect(createNewInventoryReducer(oldState, action)).to.eql(expectedState)
  })

  it('Editing an existing inventory', () => {
    const editInventoryReducer = __GetDependency__('editInventoryReducer')
    const testInventory = createInventory('TESTINVENTORY')
    const action = actions.ui.editInventory(testInventory)
    const oldState = Immutable({inventoryDialog: {mode: INVENTORYDIALOG_CLOSED}})
    const expectedState = Immutable({inventoryDialog: {
      mode: INVENTORYDIALOG_EDIT, inventory: testInventory
    }})
    expect(editInventoryReducer(oldState, action)).to.eql(expectedState)
  })

  it('Finished working with inventory edit dialog', () => {
    const editInventoryDoneReducer = __GetDependency__('editInventoryDoneReducer')
    const action = actions.ui.editInventoryDone()
    const oldState = Immutable({inventoryDialog: {mode: INVENTORYDIALOG_EDIT}})
    const expectedState = Immutable({inventoryDialog: {mode: INVENTORYDIALOG_CLOSED}})
    expect(editInventoryDoneReducer(oldState, action)).to.eql(expectedState)
  })
})
