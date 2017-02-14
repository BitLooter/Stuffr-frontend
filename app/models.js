// Code to create and manage data structures used by the program

export function createThing ({name = '', description = null, notes = null} = {}) {
  return {name, description, notes}
}

export function createInventory ({name = ''} = {}) {
  return {name}
}
