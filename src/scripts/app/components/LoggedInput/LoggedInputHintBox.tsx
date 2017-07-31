import React, { SFC } from 'react'
import LoggedInputHint from './LoggedInputHint'

export interface LoggedInputHintBoxProps {
  visible: boolean
  name: string
  hints: string[]
  selecting: number
  handleSelect: (cursor: number, offset: number) => void
}

const LoggedInputHintBox: SFC<LoggedInputHintBoxProps> = props => {
  return (
    <ul className={`hint-box ${props.visible ? 'visible' : ''}`}>
      {props.hints.map((hint, index) => (
        <LoggedInputHint key={index}
                         name={props.name}
                         hint={hint}
                         position={index + 1}
                         selecting={props.selecting}
                         handleSelect={props.handleSelect} />)
      )}
    </ul>
  )
}

export default LoggedInputHintBox
