import React from 'react'
import LoggedInputHint from './LoggedInputHint'

export interface LoggedInputHintBoxProps {
  visible: boolean
  name: string
  hints: string[]
  selecting: number
  handleSelect: (cursor: number) => void
  handleScroll: (offset: number, hintBox: HTMLUListElement) => void
}

const LoggedInputHintBox: React.SFC<LoggedInputHintBoxProps> = props => {
  let ul: HTMLUListElement

  const handleScroll = (offset: number) => {
    props.handleScroll(offset, ul)
  }

  return (
    <ul className={`hint-box ${props.visible ? 'visible' : ''}`}
        ref={(el: HTMLUListElement) => ul = el}>
      {props.hints.map((hint, index) => (
        <LoggedInputHint key={index}
                         name={props.name}
                         hint={hint}
                         position={index + 1}
                         selecting={props.selecting}
                         handleSelect={props.handleSelect}
                         handleScroll={handleScroll} />)
      )}
    </ul>
  )
}

export default LoggedInputHintBox
