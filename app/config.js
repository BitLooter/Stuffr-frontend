// Stores default configuration values and loads from a configlocal.json file
// if available.

const defaultConfig = {
  API_PATH: '/api',
  AUTH_PATH: '/auth'
}

// Tries to download a local configuration file from the server and apply it
// over the default configuration. If it is not available, returns {}.
async function getLocalConfig () {
  let localConfig
  const response = await fetch('configlocal.json')
  if (response.ok) {
    localConfig = await response.json()
  } else {
    if (response.statusText === 'NOT FOUND') {
      // Not an error, local settings file is optional
      localConfig = {}
    } else {
      throw new Error(`Error ${response.status} '${response.statusText}' reading configuration`)
    }
  }
  return localConfig
}

// Does a sanity check of the given configuration object.
function checkConfig (config) {
  if (typeof config.API_PATH !== 'string') {
    throw new Error('API_PATH must be defined')
  }
}

// Merges the local configuration file with default. Returns a promise.
export default async function loadConfig () {
  const localConfig = await getLocalConfig()
  const config = {...defaultConfig, ...localConfig}
  checkConfig(config)
  return config
}
