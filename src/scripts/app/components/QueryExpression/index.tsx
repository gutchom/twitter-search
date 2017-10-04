import React from 'react'
import Logger from 'app/stores/Logger'
import Modal from 'app/components/Modal'
import QueryTerm, { QueryCondition } from './QueryTerm'
import History from './History'

const defaultCondition: QueryCondition = {
  queryOperator: 'AND',
  keywordOperator: 'OR',
  keywords: [],
}

export interface QueryExpressionState {
  query: QueryCondition[]
  chosenPosition: number[][]
  isHistoryOpen: boolean
}

export default class QueryExpression extends React.Component<{}, QueryExpressionState> {
  queryLogger = new Logger<QueryCondition[]>('query-expression-keyword', '0.1', { size: 10 })
  chosenLogger = new Logger<number[]>('query-expression-selection', '0.1', { duration: 0 })

  state = {
    query: [defaultCondition],
    chosenPosition: ([] as number[][]),
    isHistoryOpen: false,
  }

  constructor(props: {}) {
    super(props)

    this.queryLogger.restore()
  }

  get suggestions(): string[] {
    return this.queryLogger.length > 0
      ? this.queryLogger.all
        .reduce((pre: string[], nex) => pre.concat(nex.map(({ keywords }) => keywords.join(' '))), [])
        .filter(keywords => keywords.length > 0)
        .unique()
      : []
  }

  handleQueryChange = (position: number, next: Partial<QueryCondition>) => {
    this.setState({
      query: this.state.query.map((old, index) => index === position ? { ...old, ...next } : old),
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
    this.queryLogger.save(this.state.query)
    this.forceUpdate()
  }

  handleHistoryClick = () => {
    this.setState({ isHistoryOpen: true })
  }

  handleModaleCancel = () => {
    this.setState({ isHistoryOpen: false })
  }

  handleHistorySelect = (position: number[]) => {
    const latest = this.state.chosenPosition.filter(chosen => !(position[0] === chosen[0] && position[1] === chosen[1]))

    this.chosenLogger.save(position)

    this.setState({
      chosenPosition: latest.length < this.state.chosenPosition.length ? latest : latest.concat([position]),
    })
  }

  handleUndo = () => {
    if (this.chosenLogger.canUndo) {
      this.chosenLogger.undo()
      this.setState({ chosenPosition: this.state.chosenPosition.slice(0, this.state.chosenPosition.length - 1) })
    }
  }

  handleRedo = () => {
    if (this.chosenLogger.canRedo) {
      this.setState({ chosenPosition: this.state.chosenPosition.concat([this.chosenLogger.redo()]) })
    }
  }

  handleRevertSubmit = () => {

  }

  render() {
    return (
      <ul className="query-expression">
        {...this.state.query.map((condition, index) =>
          <QueryTerm key={index}
                     position={index}
                     defaults={condition}
                     suggestions={this.suggestions}
                     onSubmit={this.handleAddClick}
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
          <Modal isOpen={this.state.isHistoryOpen}
                 onCancel={this.handleModaleCancel}
                 header={<h1><i className="fa fa-clock-o"/>履歴</h1>}
                 footer={
                   <div>
                     <button className={this.chosenLogger.canUndo ? 'enable' : ''} onClick={this.handleUndo}>
                       <i className="fa fa-undo"/>
                     </button>
                     <button className={this.chosenLogger.canRedo ? 'enable' : ''} onClick={this.handleRedo}>
                       <i className="fa fa-repeat"/>
                     </button>
                     <button className="submit" onClick={this.handleRevertSubmit}>決定</button>
                   </div>
                 }>
            <History history={this.queryLogger.all}
                     chosen={this.state.chosenPosition}
                     onSelect={this.handleHistorySelect}/>
          </Modal>
        </li>
      </ul>
    )
  }
}
