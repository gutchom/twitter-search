import React, { SFC } from 'react'
import LoggedInput from './LoggedInput/LoggedInput'

const App: SFC<{}> = () => {
  return (
    <div className="app">
      <LoggedInput name="query"/>
    </div>
  )
}

export default App
