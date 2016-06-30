// import 'babel-polyfill'
import React from 'react'
import * as ReactDOM from 'react-dom'
import * as redux from 'redux'
import { Provider } from 'react-redux'

import stuffrApp from './reducers'
import App from './components/App'
import { addThing } from './actions'

let store = redux.createStore(stuffrApp)
store.subscribe(() => console.log(store.getState()))

store.dispatch(addThing('A new thing'))
store.dispatch(addThing('Another new thing'))

window.store = store

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
