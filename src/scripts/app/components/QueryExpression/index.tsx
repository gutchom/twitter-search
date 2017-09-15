import React from 'react'
import Logger from 'app/stores/Logger'
import ExpressionTerm, { QueryTerm, QueryTermElement } from './ExpressionTerm'
import { immutable } from 'array-unique'

export interface QueryExpressionProps {
}

export interface QueryExpressionState {
  terms: QueryTerm[]
}

class QueryExpression extends React.Component<QueryExpressionProps, QueryExpressionState> {
  logger: Logger<QueryTerm[]> = new Logger('query-expression', '1.0')
  state: QueryExpressionState = {
    terms: [{
      interOperation: 0,
      coOperation: 1,
      keywords: [],
    }],
  }

  constructor(props: QueryExpressionProps) {
    super(props)

    this.logger.restore()
  }

  handleQueryChange = (position: number, query: QueryTermElement) => {
    this.setState({
      terms: this.state.terms.map((term, index) => index === position ? {...term, ...query} : term),
    })
  }

  handleQueryRemove = (position: number) => {
    this.setState({
      terms: this.state.terms.filter((term, index) => index !== position),
    })
  }

  handleAddClick = () => {
    this.setState({
      terms: this.state.terms.concat({
        interOperation: 0,
        coOperation: 1,
        keywords: [],
      }),
    })
  }

  handleSearchClick = () => {
    this.logger.save(this.state.terms)
    this.forceUpdate()
  }

  handleHistoryClick = () => {
    console.log(this.logger.all)
  }

  render() {
    const history = this.logger.length > 0
      ? immutable(
        this.logger.all
          .map(terms => terms.map(term => term.keywords))
          .reduce((pre, nex) => pre.concat(nex), [])
          .map(keywords => keywords.join(' '))
          .filter(keyword => keyword.length > 0)
      ) : []

    return (
      <ul className="query-expression">
        {...this.state.terms.map((term, index) =>
          <ExpressionTerm key={index}
                          onChange={this.handleQueryChange}
                          onRemove={this.handleQueryRemove}
                          position={index}
                          history={history}
                          defaultValue={term}/>
        )}
        <li className="query-expression--term">
          <button className="query-expression--button" onClick={this.handleHistoryClick}>
            <i className="fa fa-clock-o"/>
          </button>
          <button className="query-expression--button" onClick={this.handleAddClick}>
            <i className="fa fa-plus"/>
          </button>
          <button className="query-expression--button" onClick={this.handleSearchClick}>
            <i className="fa fa-search"/>
          </button>
        </li>
      </ul>
    )
  }
}

export default QueryExpression
