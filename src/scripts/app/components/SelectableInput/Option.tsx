import React from 'react'

export interface OptionProps {
  text: string
  checked: boolean
  position: number
  onClick(cursor: number): void
}

const Option: React.SFC<OptionProps> = props => {
  function handleClick() {
    props.onClick(props.position)
  }

  return (
    <li className="query-input--option">
      <label>
        <input className="checkbox"
               type="checkbox"
               tabIndex={-1}
               checked={props.checked}
               onClick={handleClick} />
        <div className="query-input--option--container">{props.text}</div>
      </label>
    </li>
  )
}

export default Option
