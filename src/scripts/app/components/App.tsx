import React, { SFC } from 'react'
import LoggedInput from './LoggedInput/LoggedInput'

const App: SFC<{}> = () => {
  return (
    <div className="app">
      <h1>Hello, world!</h1>
      <LoggedInput name="query"/>
    </div>
  )
}

export default App
