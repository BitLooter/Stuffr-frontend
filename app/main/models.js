// Code to create and manage data structures used by the program

export function createThing ({name = '', location = null, details = null} = {}) {
  return {name, location, details}
}

export function createInventory ({name = ''} = {}) {
  return {name}
}
