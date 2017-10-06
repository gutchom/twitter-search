import React from 'react'
import Logger from 'app/stores/Logger'
import QueryTerm, { QueryCondition } from './QueryTerm'
import Revert from './Revert'

const defaultCondition: QueryCondition = {
  queryOperator: 'AND',
  keywordOperator: 'OR',
  keywords: [],
}

interface Query extends QueryCondition {
  id: number
}

export interface QueryExpressionState {
  query: Query[]
  suggestions: string[]
  isHistoryOpen: boolean
}

export default class QueryExpression extends React.Component<{}, QueryExpressionState> {
  logger = new Logger<QueryCondition[]>('query', '1.0', { size: 10 })
  queryId = 0

  state = {
    query: [{ id: 0, ...defaultCondition }],
    suggestions: this.suggestions,
    isHistoryOpen: false,
  }

  constructor(props: {}) {
    super(props)

    this.logger.restore()
  }

  get suggestions(): string[] {
    return this.logger.length > 0
      ? this.logger.all
        .reduce((pre: string[], nex) => pre.concat(nex.map(({ keywords }) => keywords.join(' '))), [])
        .filter(keywords => keywords.length > 0)
        .unique()
      : []
  }

  handleQueryChange = (position: number, next: Partial<QueryCondition>) => {
    this.setState({ query: this.state.query.map((old, index) => index === position ? { ...old, ...next } : old) })
  }

  handleQueryRemove = (position: number) => {
    this.setState({ query: this.state.query.filter((_, index) => index !== position) })
  }

  handleAddClick = () => {
    this.setState({ query: this.state.query.concat({ id: ++this.queryId, ...defaultCondition }) })
  }

  handleSearchClick = () => {
    const query = this.state.query.filter(({ keywords }) => keywords.length > 0)
    if (query.length > 0) {
      this.logger.save(query)
      this.setState({ suggestions: this.suggestions })
    }
  }

  handleRevertClick = () => {
    this.setState({ isHistoryOpen: true })
  }

  handleRevertCancel = () => {
    this.setState({ isHistoryOpen: false })
  }

  handleRevertSubmit = (query: QueryCondition[]) => {
    this.setState({
      query: query.map(condition => ({ ...condition, id: ++this.queryId })),
      isHistoryOpen: false,
    })
  }

  render() {
    return (
      <ul className="query-expression">
        {...this.state.query.map((condition, index) =>
          <QueryTerm key={condition.id}
                     position={index}
                     defaults={condition}
                     suggestions={this.suggestions}
                     onChange={this.handleQueryChange}
                     onRemove={this.handleQueryRemove} />
        )}

        <li className="query-expression--dashboard">
          <button className="query-expression--button" onClick={this.handleRevertClick}>
            <i className="fa fa-clock-o"/>
          </button>
          <button className="query-expression--button" onClick={this.handleAddClick}>
            <i className="fa fa-plus"/>
          </button>
          <button className="query-expression--button" onClick={this.handleSearchClick}>
            <i className="fa fa-search"/>
          </button>
        </li>

        <li>
          <Revert history={this.logger.all.reverse()}
                  isOpen={this.state.isHistoryOpen}
                  onCancel={this.handleRevertCancel}
                  onSubmit={this.handleRevertSubmit}/>
        </li>
      </ul>
    )
  }
}
