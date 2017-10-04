import React from 'react'
import HistoryItem from './HistoryItem'
import { QueryCondition } from './QueryTerm'

export interface HistoryProps {
  chosen: number[][]
  history: QueryCondition[][]
  onSelect(position: number[]): void
}

const History: React.SFC<HistoryProps> = props => {
  return (
    <ul className="history">
      {props.history.map((query, historyIndex) =>
        <li className="history--item" key={historyIndex}>
          <ul>
            {query.map((condition, queryIndex) =>
              <HistoryItem key={queryIndex}
                           checked={-1 !== props.chosen.findIndex(position =>
                             position[0] === historyIndex && position[1] === queryIndex)}
                           position={[historyIndex, queryIndex]}
                           condition={condition}
                           onChange={props.onSelect}/>
            )}
          </ul>
        </li>
        )}
    </ul>
  )
}

export default History
