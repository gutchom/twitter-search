import React from 'react'
import Logger from 'app/stores/Logger'
import QueryTerm, { QueryCondition } from './QueryTerm'

const defaultCondition: QueryCondition = {
  queryOperator: 'AND',
  keywordOperator: 'OR',
  keywords: [],
}

export interface QueryExpressionState {
  query: QueryCondition[]
}

class QueryExpression extends React.Component<{}, QueryExpressionState> {
  logger = new Logger<QueryCondition[]>('query-expression', '1.0', { size: 20 })
  state = {
    query: [defaultCondition],
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

  handleQueryChange = (position: number, next: QueryCondition) => {
    this.setState({
      query: this.state.query.map((old, index) => index === position ? next : old),
    })
  }

  handleQueryRemove = (position: number) => {
    this.setState({
      query: this.state.query.filter((_, index) => index !== position),
    })
  }

  handleAddClick = () => {
    this.setState({
      query: this.state.query.concat(defaultCondition),
    })
  }

  handleSearchClick = () => {
    this.logger.save(this.state.query)
    this.forceUpdate()
  }

  handleHistoryClick = () => {
    console.log(this.logger.all)
  }

  render() {
    return (
      <ul className="query-expression">
        {...this.state.query.map((condition, index) =>
          <QueryTerm key={index}
                     position={index}
                     defaults={condition}
                     suggestions={this.suggestions}
                     onChange={this.handleQueryChange}
                     onRemove={this.handleQueryRemove} />
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
        <li>
          <Modal isOpen={this.state.isHistoryOpen} onCancel={this.handleModaleCancel}>
            <History history={this.logger.all} onRevert={this.handleHistoryRevert}/>
          </Modal>
        </li>
      </ul>
    )
  }
}

export default QueryExpression
