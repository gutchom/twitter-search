import React, { ChangeEvent } from 'react'
import LoggedInput from '../LoggedInput'

export enum LogicalOperation {
  AND,
  OR,
  NOR,
}

export interface QueryTerm {
  interOperation: LogicalOperation
  coOperation: LogicalOperation
  keywords: string[]
}

export interface QueryTermElement {
  [key: string]: LogicalOperation|string[]
}

export interface ExpressionTermProps {
  defaultValue?: QueryTerm
  history: string[]
  position: number
  onChange(position: number, query: QueryTermElement): void
  onRemove(position: number): void
}

export interface ExpressionTermState extends QueryTerm {
}

class ExpressionTerm extends React.Component<ExpressionTermProps, ExpressionTermState> {
  state = {
    interOperation: this.props.defaultValue ? this.props.defaultValue.interOperation : LogicalOperation.AND,
    coOperation: this.props.defaultValue ? this.props.defaultValue.coOperation : LogicalOperation.AND,
    keywords: this.props.defaultValue ? this.props.defaultValue.keywords : [],
  }

  constructor(props: ExpressionTermProps) {
    super(props)
  }

  handleInterOperationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ interOperation: parseInt(e.target.value, 10) as LogicalOperation })
    this.props.onChange(this.props.position, { interOperation: parseInt(e.target.value, 10) as LogicalOperation })
  }

  handleCoOperationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ coOperation: parseInt(e.target.value, 10) as LogicalOperation })
    this.props.onChange(this.props.position, { coOperation: parseInt(e.target.value, 10) as LogicalOperation })
  }

  handleInputChange = (keywords: string) => {
    this.setState({ keywords: (keywords || '').replace(/\s+/g, ' ').split(/\s/) })
    this.props.onChange(this.props.position, { keywords: (keywords || '').replace(/\s+/g, ' ').split(/\s/) })
  }

  handleRemove = () => {
    this.props.onRemove(this.props.position)
  }

  render() {
    return (
      <li className="query-expression--term">
        {this.props.position === 0 ? '' : (
          <select className="logical-operator"
                  value={this.state.interOperation}
                  onChange={this.handleInterOperationChange}>
            <option value={LogicalOperation.AND}>なおかつ</option>
            <option value={LogicalOperation.OR}>もしくは</option>
          </select>
        )}

        <LoggedInput defaultValue={this.state.keywords}
                     history={this.props.history}
                     onChange={this.handleInputChange}
                     onRemove={this.handleRemove}/>

        <select className="logical-operator"
                value={this.state.coOperation}
                onChange={this.handleCoOperationChange}>
          <option value={LogicalOperation.AND}>を全て含む</option>
          <option value={LogicalOperation.OR}>のどれかを含む</option>
          <option value={LogicalOperation.NOR}>のどれも含まない</option>
        </select>
      </li>
    )
  }
}

export default ExpressionTerm
