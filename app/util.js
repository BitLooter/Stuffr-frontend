// Misc utility functions used in multiple Places

export function isString (value) {
  return typeof value === 'string' || value instanceof String
}

// Checks that an object has no values (equal to {})
export function isEmpty (obj) {
  return Object.keys(obj).length === 0
}
