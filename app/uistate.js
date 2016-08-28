import * as models from './models'

export let updateUI

const placeholderThing = models.createThing('PLACEHOLDER')
export const defaultUIState = {
  thingDialog: createThingDialogState(false)
}

function createThingDialogState (open, thing) {
  if (thing === undefined) thing = placeholderThing
  return {open, thing}
}

export function setUpdateUIFunction (func) {
  updateUI = func
}

export function showThingEditDialog (mode, thing) {
  updateUI('thingDialog', createThingDialogState(true, thing))
}

export function hideThingEditDialog () {
  updateUI('thingDialog', createThingDialogState(false))
}
