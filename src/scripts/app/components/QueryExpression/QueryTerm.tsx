import React, { ChangeEvent } from 'react'
import SelectableInput from 'app/components/SelectableInput'

export type QueryOperator = 'AND' | 'OR'

export type LogicalOperator =  QueryOperator | 'NOR'

export interface QueryCondition {
  keywords: string[]
  queryOperator: QueryOperator
  keywordOperator: LogicalOperator
}

export interface QueryTermProps {
  position: number
  defaults: QueryCondition
  suggestions: string[]
  onChange(position: number, condition: QueryCondition): void
  onRemove(position: number): void
}

export enum Operator { AND, OR, NOR }

export const translate = {
  sign: ['+', '?', '-'],
  queryJa: ['なおかつ', 'もしくは'],
  keysJa: ['の全てを含む', 'のどれかを含む', 'のどれも含まない'],
}

export default class QueryTerm extends React.Component<QueryTermProps, QueryCondition> {
  state = this.props.defaults

  handleChange(param: Partial<QueryCondition>) {
    this.setState({ ...this.state, ...param })
    this.props.onChange(this.props.position, { ...this.state, ...param })
  }

  handleKeywordChange = (keywords: string[]) => {
    this.handleChange({ keywords })
  }

  handleQueryOperatorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    this.handleChange({ queryOperator: e.target.value as QueryOperator })
  }

  handleKeywordOperatorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    this.handleChange({ keywordOperator: e.target.value as LogicalOperator })
  }

  handleRemove = () => {
    this.props.onRemove(this.props.position)
  }

  render() {
    return (
      <li className="query-expression--term">
        {this.props.position === 0 ? '' : (
          <select className="logical-operator"
                  value={this.state.queryOperator}
                  onChange={this.handleQueryOperatorChange}>
            {Array(2).fill(null).map((_, type) =>
              <option value={Operator[type]}>{translate.queryJa[type]}</option>
            )}
          </select>
        )}

        <SelectableInput defaults={this.state.keywords}
                         options={this.props.suggestions}
                         onChange={this.handleKeywordChange}
                         onRemove={this.handleRemove}/>

        <select className="logical-operator"
                value={this.state.keywordOperator}
                onChange={this.handleKeywordOperatorChange}>
          {Array(3).fill(null).map((_, type) =>
            <option value={Operator[type]}>{translate.keysJa[type]}</option>
          )}
        </select>
      </li>
    )
  }
}
