import React from 'react'
import HistoryItem from './HistoryItem'

export interface LHistoryListProps {
  visible: boolean
  history: string[]
  selecting: number
  boxRef(el: HTMLUListElement): void
  handleSelect(cursor: number): void
}

const HistoryList: React.SFC<LHistoryListProps> = props => {
  return (
    <ul ref={props.boxRef} className={`history--list ${props.visible ? 'visible' : ''}`}>
      {props.history.map((log, index) => (
        <HistoryItem key={index}
                     log={log}
                     position={index + 1}
                     selecting={props.selecting}
                     handleSelect={props.handleSelect} />)
      )}
    </ul>
  )
}

export default HistoryList
