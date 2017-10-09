import React from 'react'
import Condition from './Condition'
import { QueryCondition } from './QueryTerm'

export interface RevertItemProps {
  checked: boolean
  focusing: boolean
  position: number[]
  condition: QueryCondition
  onChange(position: number[]): void
}

const RevertItem: React.SFC<RevertItemProps> = props => {
  function handleClick() {
    props.onChange(props.position)
  }

  return (
    <li className={`query-condition ${props.focusing ? 'focusing' : ''}`}>
      <label>
        <input className="checkbox"
               type="checkbox"
               tabIndex={-1}
               checked={props.checked}
               onClick={handleClick} />
        <Condition {...props.condition} />
      </label>
    </li>
  )
}

export default RevertItem
