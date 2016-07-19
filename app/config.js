// Stores default configuration values and loads from a configlocal.json file
// if available.

class ConfigError extends Error {}

const defaultConfig = {
  API_PATH: '/api'
}

async function getLocalConfig() {
  let localConfig
  let response = await fetch('configlocal.json')
  if (response.ok) {
    localConfig = await response.json()
  } else {
    if (response.statusText === 'NOT FOUND') {
      // Not an error, local settings file is optional
      localConfig = {}
    } else {
      // TODO: Throw an error here
    }
  }

  return localConfig
}

function checkConfig(config) {
  if (config.API_PATH === null) {
    throw new ConfigError("API_PATH must be defined")
  }
}

export default async function loadConfig () {
  const localConfig = await getLocalConfig()
  const config = {...defaultConfig, ...localConfig}
  checkConfig(config)
  return config
}
