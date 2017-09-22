/* Contains common code and data for localization. */

import i18next, { t } from 'i18next'
import i18nextFetch from 'i18next-fetch-backend'
import log from 'loglevel'

export default t

export function i18nSetup (
  options, ns,
  {synchronous = false, debug = false} = {}
) {
  const baseOptions = {
    lng: 'en',
    fallbackLng: 'en',
    ns,
    defaultNS: ns,
    initImmediate: !synchronous,
    saveMissing: true,
    missingKeyHandler: (lng, ns, key) =>
      log.error(`Missing key: ${lng}:${ns}:${key}`),
    parseMissingKeyHandler: (key) => `MISSING_KEY: ${key}`,
    debug
  }

  // If fetch backend options are passed enable the plugin, otherwise use
  // it as translation data
  let i18nextWithPlugins = i18next
  let sourceOptions = {resources: options}
  if (options.hasOwnProperty('loadPath')) {
    i18nextWithPlugins = i18next.use(i18nextFetch)
    sourceOptions = {backend: options}
  }
  const fullOptions = {...baseOptions, ...sourceOptions}
  return new Promise((resolve, reject) => {
    i18nextWithPlugins.init(fullOptions, (error, t) => {
      if (error) { reject(error) }
      resolve(t)
    })
  })
}
