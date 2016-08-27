const placeholderThing = {
  name: 'PLACEHOLDER'
}

export function createThingDialogState (open, thing) {
  if (thing === undefined) thing = placeholderThing
  return {open, thing}
}
