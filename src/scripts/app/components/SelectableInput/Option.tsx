import React from 'react'

export interface OptionProps {
  checked: boolean
  position: number
  option: string
  onChange(cursor: number): void
}

const Option: React.SFC<OptionProps> = props => {
  if (props.checked) { props.onChange(props.position) }

  function handleClick() {
    props.onChange(props.position)
  }

  return (
    <li className="query-input--option">
      <label>
        <input className="checkbox"
               type="checkbox"
               tabIndex={-1}
               checked={props.checked}
               value={props.position}
               onClick={handleClick} />
        <div className="query-input--option--container">
          <span className="query-input--option--body">{props.option}</span>
        </div>
      </label>
    </li>
  )
}

export default Option
