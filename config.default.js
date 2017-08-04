module.exports = {
  /* apiPath/authPath are the base URLs the client uses to make requests. Can
     be relative or absolute. */
  apiPath: '/api',
  authPath: '/auth',

  /* The address and port the dev server binds to. The default localhost will
     only allow access from the current device; if you want to access the dev
     server remotely you will need to changes this. Either use the address of
     the interface you wish to allow access or 0.0.0.0 to allow access from
     anywhere. */
  devServerHost: 'localhost',
  devServerPort: 8080,

  /* The address browsers will use to access the dev server. Normally
     localhost:8080, but if you want to access the dev server from another\
     device you will need to change this. */
  publicServerHost: 'localhost',
  publicServerPort: 8080,

  /* The address and port of the backend server that the dev server API proxy
     will use. */
  devProxyHost: 'localhost',
  devProxyPort: 5000,

  /* The minimum log level to print to console. From low to high 'trace',
     'debug', 'info', 'warn', and 'error'. */
  logLevel: 'info'
}
