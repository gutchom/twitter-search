import React, { SFC } from 'react'
import QueryExpression from './QueryExpression'

const App: SFC<{}> = () => {
  return (
    <div className="app">
      <header><h1><i className="fa fa-search"/>検索</h1></header>
      <QueryExpression/>
    </div>
  )
}

export default App
