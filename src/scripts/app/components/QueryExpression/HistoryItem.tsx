import React from 'react'
import Condition from './Condition'
import { QueryCondition } from './QueryTerm'

export interface HistoryItemProps {
  checked: boolean
  position: number[]
  condition: QueryCondition
  onChange(index: number[]): void
}

const HistoryItem: React.SFC<HistoryItemProps> = props => {
  function handleClick() {
    props.onChange(props.position)
  }

  return (
    <li className="query-condition">
      <label>
        <input className="checkbox"
               type="checkbox"
               tabIndex={-1}
               checked={props.checked}
               onChange={handleClick}/>
        <Condition keywords={props.condition.keywords}
                   queryOperator={props.condition.queryOperator}
                   keywordOperator={props.condition.keywordOperator} />
      </label>
    </li>
  )
}

export default HistoryItem
