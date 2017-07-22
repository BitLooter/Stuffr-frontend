/* eslint-env mocha */
// Turn off the unused expressions tool, they are used by Chai for testing
/* eslint no-unused-expressions: off */

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
    const openThingEditorReducer = __GetDependency__('openThingEditorReducer')
    const testThing = createThing()
    const action = actions.openThingEditor()
    const oldState = Immutable({thingDialog: {mode: DIALOG_CLOSED}})
    const expectedState = Immutable({thingDialog: {
      mode: DIALOG_NEW, thing: testThing
    }})
    expect(openThingEditorReducer(oldState, action)).to.eql(expectedState)
  })

  it('Editing an existing thing', () => {
    const openThingEditorReducer = __GetDependency__('openThingEditorReducer')
    const testThing = createThing('TESTTHING')
    const action = actions.openThingEditor(testThing)
    const oldState = Immutable({thingDialog: {mode: DIALOG_CLOSED}})
    const expectedState = Immutable({thingDialog: {
      mode: DIALOG_EDIT, thing: testThing
    }})
    expect(openThingEditorReducer(oldState, action)).to.eql(expectedState)
  })

  it('Finished working with thing edit dialog', () => {
    const closeThingEditorReducer = __GetDependency__('closeThingEditorReducer')
    const action = actions.closeThingEditor()
    const oldState = Immutable({thingDialog: {mode: DIALOG_EDIT}})
    const expectedState = Immutable({thingDialog: {mode: DIALOG_CLOSED}})
    expect(closeThingEditorReducer(oldState, action)).to.eql(expectedState)
  })

  it('Creating a new inventory', () => {
    const openInventoryEditorReducer = __GetDependency__('openInventoryEditorReducer')
    const testInventory = createInventory()
    const action = actions.openInventoryEditor()
    const oldState = Immutable({inventoryDialog: {mode: DIALOG_CLOSED}})
    const expectedState = Immutable({inventoryDialog: {
      mode: DIALOG_NEW, inventory: testInventory
    }})
    expect(openInventoryEditorReducer(oldState, action)).to.eql(expectedState)
  })

  it('Editing an existing inventory', () => {
    const openInventoryEditorReducer = __GetDependency__('openInventoryEditorReducer')
    const testInventory = createInventory('TESTINVENTORY')
    const action = actions.openInventoryEditor(testInventory)
    const oldState = Immutable({inventoryDialog: {mode: DIALOG_CLOSED}})
    const expectedState = Immutable({inventoryDialog: {
      mode: DIALOG_EDIT, inventory: testInventory
    }})
    expect(openInventoryEditorReducer(oldState, action)).to.eql(expectedState)
  })

  it('Finished working with inventory edit dialog', () => {
    const closeInventoryEditorReducer = __GetDependency__('closeInventoryEditorReducer')
    const action = actions.closeInventoryEditor()
    const oldState = Immutable({inventoryDialog: {mode: DIALOG_EDIT}})
    const expectedState = Immutable({inventoryDialog: {mode: DIALOG_CLOSED}})
    expect(closeInventoryEditorReducer(oldState, action)).to.eql(expectedState)
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
