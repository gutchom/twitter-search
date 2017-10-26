import React from 'react'
import Logger from 'app/stores/Logger'
import QueryTerm, { QueryCondition } from './QueryTerm'
import Revert from './Revert'
import Header from 'app/components/Header'

const defaultCondition: QueryCondition = {
  id: 0,
  focus: false,
  operator: 'OR',
  keywords: [],
}

export interface QueryExpressionState {
  query: QueryCondition[]
  suggestions: string[]
  isHistoryOpen: boolean
}

export default class QueryExpression extends React.Component<{}, QueryExpressionState> {
  logger = new Logger<QueryCondition[]>('query', 1.5, { range: 20, useStorage: true })
  queryId = 0

  constructor(props: {}) {
    super(props)

    this.logger.restore()

    this.state = {
      query: [defaultCondition],
      suggestions: this.suggestions,
      isHistoryOpen: false,
    }
  }

  get suggestions(): string[] {
    return this.logger.length > 0
      ? this.logger.all
        .reduce((keywords: string[], condition) => keywords.concat(...condition.map(({ keywords }) => keywords)), [])
        .filter(keyword => keyword.length > 0)
        .filter((keyword, index, self) => index === self.lastIndexOf(keyword))
      : []
  }

  handleQueryChange = (position: number, next: Partial<QueryCondition>) => {
    this.setState({ query: this.state.query.map((old, index) => index === position ? { ...old, ...next } : old) })
  }

  handleQueryRemove = (position: number) => {
    this.setState({ query: this.state.query.filter((_, index) => index !== position) })
  }

  handleAddClick = () => {
    this.setState({ query: this.state.query.concat({ ...defaultCondition, id: ++this.queryId, focus: true }) })
  }

  handleSearchClick = () => {
    const query = this.state.query.filter(({ keywords }) => keywords.filter(keyword => keyword.length > 0).length > 0)
    if (query.length > 0) {
      this.logger.save(query)
      this.setState({ suggestions: this.suggestions })
    }
    alert('検索条件を履歴に保存しました。\n検索結果の表示は開発中です。')
  }

  handleRevertClick = () => {
    this.setState({ isHistoryOpen: true })
  }

  handleRevertCancel = () => {
    this.setState({ isHistoryOpen: false })
  }

  handleRevertSubmit = (query: QueryCondition[]) => {
    this.setState({
      query: query.map(condition => ({ ...condition, id: ++this.queryId, focus: false })),
      isHistoryOpen: false,
    })
  }

  render() {
    return (
      <main className="query">
        <Header icon="search" title="検索" />
        <ul>
          {...this.state.query.map((condition, index) =>
            <QueryTerm
              key={condition.id}
              focus={condition.focus}
              position={index}
              defaults={condition}
              suggestions={this.state.suggestions}
              onChange={this.handleQueryChange}
              onRemove={this.handleQueryRemove}
            />
          )}
          <li className="query--dashboard">
            <button className="query--button" onClick={this.handleRevertClick}>
              <i className="fa fa-clock-o" />
            </button>
            <button className="query--button" onClick={this.handleAddClick}>
              <i className="fa fa-plus" />
            </button>
            <button className="query--button" onClick={this.handleSearchClick}>
              <i className="fa fa-search" />
            </button>
          </li>
        </ul>
        <Revert
          history={this.logger.all.reverse()}
          visible={this.state.isHistoryOpen}
          onCancel={this.handleRevertCancel}
          onSubmit={this.handleRevertSubmit}
        />
      </main>
    )
  }
}
