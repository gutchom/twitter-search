import React from 'react'
import Option from './Option'

export interface DrawerProps {
  visible: boolean
  options: string[]
  focusing: number
  selected: string[]
  refs(el: HTMLUListElement): void
  onClick(cursor: number): void
}

const Drawer: React.SFC<DrawerProps> = props => {
  return (
    <ul ref={props.refs} className={`query-input--drawer ${props.visible ? 'visible' : ''}`}>
      {props.options.map((option, index) =>
        <Option key={option}
                text={option}
                checked={-1 !== props.selected.findIndex(word => word === option)}
                focusing={index + 1 === props.focusing}
                position={index + 1}
                onClick={props.onClick} />
      )}
    </ul>
  )
}

export default Drawer
