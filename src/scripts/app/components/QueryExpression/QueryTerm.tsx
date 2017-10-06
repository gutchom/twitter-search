import React, { ChangeEvent } from 'react'
import SelectableInput from 'app/components/SelectableInput'

export type QueryOperator = 'AND' | 'OR'

export type LogicalOperator =  QueryOperator | 'NOR'

export enum Operator { AND, OR, NOR }

export const translate = {
  sign: ['+', '?', '-'],
  queryJa: ['なおかつ', 'もしくは'],
  keysJa: ['の全てを含む', 'のどれかを含む', 'のどれも含まない'],
}

export interface QueryCondition {
  keywords: string[]
  queryOperator: QueryOperator
  keywordOperator: LogicalOperator
}

export interface QueryTermProps {
  position: number
  defaults: QueryCondition
  suggestions: string[]
  onChange(position: number, condition: Partial<QueryCondition>): void
  onRemove(position: number): void
}

export interface QueryTermState extends QueryCondition {
  confirming: boolean
}

export default class QueryTerm extends React.Component<QueryTermProps, QueryTermState> {
  state = {
    ...this.props.defaults,
    confirming: false,
  }

  handleKeywordChange = (keywords: string[]) => {
    this.setState({ keywords })
    this.props.onChange(this.props.position, { keywords })
  }

  handleQueryOperatorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ queryOperator: e.target.value as QueryOperator })
    this.props.onChange(this.props.position, { queryOperator: e.target.value as QueryOperator })
  }

  handleKeywordOperatorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ keywordOperator: e.target.value as LogicalOperator })
    this.props.onChange(this.props.position, { keywordOperator: e.target.value as LogicalOperator })
  }

  handleRemove = () => {
    if (this.state.confirming) {
      this.props.onRemove(this.props.position)
    } else {
      this.setState({ confirming: true })
    }
  }

  handleCancelRemove = () => {
    this.setState({ confirming: false })
  }

  render() {
    return (
      <li className="query-expression--term">
        {this.state.confirming && (
          <div className="query-expression--confirm" onClick={this.handleCancelRemove}>
            <button className="query-expression--confirm--remove" onClick={this.handleRemove}>
              <i className="fa fa-trash-o"/>
            </button>
          </div>
        )}

        {this.props.position === 0 ||
          <select value={this.state.queryOperator}
                  onChange={this.handleQueryOperatorChange}>
            {Array(2).fill(null).map((_, index) =>
              <option key={index} value={Operator[index]}>{translate.queryJa[index]}</option>
            )}
          </select>
        }

        <SelectableInput defaults={this.state.keywords}
                         options={this.props.suggestions}
                         onChange={this.handleKeywordChange}
                         onRemove={this.handleRemove}/>

        <select value={this.state.keywordOperator}
                onChange={this.handleKeywordOperatorChange}>
          {Array(3).fill(null).map((_, index) =>
            <option key={index} value={Operator[index]}>{translate.keysJa[index]}</option>
          )}
        </select>
      </li>
    )
  }
}
