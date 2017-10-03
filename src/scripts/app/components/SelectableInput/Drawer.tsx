import React from 'react'
import DrawerOption from './Option'

export interface DrawerProps {
  visible: boolean
  options: string[]
  chosen: number
  ref(el: HTMLUListElement): void
  onChange(cursor: number): void
}

const Drawer: React.SFC<DrawerProps> = props => {
  return (
    <ul ref={props.ref} className={`query-input--drawer${props.visible ? ' visible' : ''}`}>
      {props.options.map((option, index) =>
        <DrawerOption key={index}
                      option={option}
                      position={index + 1}
                      checked={(index + 1 === props.chosen)}
                      onChange={props.onChange} />
      )}
    </ul>
  )
}

export default Drawer
