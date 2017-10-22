import React from 'react'
import Option from './Option'

export interface DrawerProps {
  visible: boolean
  options: string[]
  focusing: number
  selected: string[]
  refs(el: HTMLUListElement): void
  onChange(cursor: number): void
}

const Drawer: React.SFC<DrawerProps> = props => (
  <ul ref={props.refs} className={`query-input--drawer ${props.visible ? 'visible' : ''}`}>
    {props.options.map((option, index) => (
      <Option
        key={option}
        text={option}
        checked={-1 !== props.selected.findIndex(word => word === option)}
        focusing={index + 1 === props.focusing}
        position={index + 1}
        onChange={props.onChange}
      />
    ))}
  </ul>
)

export default Drawer
