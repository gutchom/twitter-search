import React from 'react'

export interface OptionProps {
  text: string
  checked: boolean
  focusing: boolean
  position: number
  onChange(cursor: number): void
}

const Option: React.SFC<OptionProps> = props => {
  function handleClick() {
    props.onChange(props.position)
  }

  return (
    <li className="query-input--option">
      <label>
        <input
          className="checkbox"
          type="checkbox"
          tabIndex={-1}
          checked={props.checked}
          onChange={handleClick}
          onClick={handleClick} />
        <div className={`query-input--option--container ${props.focusing ? 'focusing' : ''}`}>{props.text}</div>
      </label>
    </li>
  )
}

export default Option
