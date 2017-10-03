import React from 'react'

export interface HistoryItemProps {
  log: string
  position: number
  selecting: number
  handleSelect(cursor: number): void
}

const HistoryItem: React.SFC<HistoryItemProps> = props => {
  return (
    <li className="history--item">
      <label>
        <input className="checkbox"
               type="checkbox"
               tabIndex={-1}
               value={props.position}
               checked={(props.position === props.selecting)}
               onClick={() => props.handleSelect(props.position)}/>
        <div className="history--item--container">
          <span className="history--item--body">{props.log}</span>
        </div>
      </label>
    </li>
  )
}

export default HistoryItem
