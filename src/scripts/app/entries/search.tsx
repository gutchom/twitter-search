import React from 'react'
import ReactDOM from 'react-dom'
import App from 'app/components/App'
import { immutable } from 'array-unique'

Array.prototype.unique = function() { return immutable(this) }

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
