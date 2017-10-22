import React from 'react'
import Condition from './Condition'
import { QueryCondition } from './QueryTerm'

export interface RevertItemProps {
  checked: boolean
  position: number[]
  condition: QueryCondition
  onChange(position: number[]): void
}

const RevertItem: React.SFC<RevertItemProps> = props => (
  <li className="query-condition">
    <label>
      <input
        className="checkbox"
        type="checkbox"
        checked={props.checked}
        onChange={function() { props.onChange(props.position) }}
      />
      <Condition {...props.condition} />
    </label>
  </li>
)

export default RevertItem
