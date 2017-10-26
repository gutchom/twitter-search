import React, { ChangeEvent } from 'react'
import SelectableInput from 'app/components/SelectableInput'
import classes from 'app/lib/classNames'

export type Operator = 'AND' | 'OR' | 'NOT'

export const operators: Operator[] = ['AND', 'OR', 'NOT']

export const translate = {
  sign: {
    AND: '&',
    OR: '?',
    NOT: '-',
  },
  ja: {
    AND: 'を全て含む',
    OR: 'のどれかを含む',
    NOT: 'を全て含まない',
  },
}

export interface QueryCondition {
  id: number
  focus: boolean
  keywords: string[]
  operator: Operator
}

export interface QueryTermProps {
  focus: boolean
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

  handleKeywordOperatorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ operator: e.target.value as Operator })
    this.props.onChange(this.props.position, { operator: e.target.value as Operator })
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
      <li className="query--term">
        <div
          className={classes('query--confirm-deletion', { visible: this.state.confirming })}
          tabIndex={0}
          onClick={this.handleCancelRemove}
          onKeyDown={this.handleCancelRemove}
        >
          <button className="query--confirm-deletion--remove" onClick={this.handleRemove}>
            <i className="fa fa-trash-o"/>
          </button>
        </div>

        <button className="query--remove" onClick={this.handleRemove}>
          <i className="fa fa-trash-o"/>
        </button>

        <SelectableInput
          defaults={this.state.keywords}
          focus={this.props.focus}
          choices={this.props.suggestions}
          onChange={this.handleKeywordChange}
        />

        <select value={this.state.operator} onChange={this.handleKeywordOperatorChange}>
          {operators.map((operator, index) =>
            <option key={operator} value={operator}>{translate.ja[operator]}</option>
          )}
        </select>
      </li>
    )
  }
}
