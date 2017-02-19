module.exports = {
  /* apiPath/authPath are the base URLs the client uses to make requests. Can
     be relative or absolute. */
  apiPath: '/api',
  authPath: '/auth',

  /* The hostname of the dev server. Normally localhost, but if the server is
     on a remote system you'll need to override this. */
  clientServerHost: 'localhost',

  /* The address and port the dev server binds to. As with clientServerHost,
     you will need to change the address on remote systems or else only
     localhost will have access to the server. */
  devServerHost: 'localhost',
  devServerPort: 8080,

  /* The address and port of the backend server that the dev server will proxy
     API requests towards. */
  devProxyHost: 'localhost',
  devProxyPort: 5000
}
