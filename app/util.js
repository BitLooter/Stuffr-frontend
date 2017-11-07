// Misc utility functions used in multiple places

/* Constants
 ************/
// Key in localStorage where the auth token is persisted
export const authTokenKey = `${global.siteConfig.prefix}_apiToken`

/* Functions
 ************/

export function isString (value) {
  return typeof value === 'string' || value instanceof String
}

// Checks that an object has no values (equal to {})
export function isEmpty (obj) {
  return Object.keys(obj).length === 0
}
