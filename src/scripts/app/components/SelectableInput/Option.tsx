import React from 'react'

export interface OptionProps {
  checked: boolean
  position: number
  option: string
  onChange(cursor: number): void
}

const Option: React.SFC<OptionProps> = props => {
  function handleChange() {
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
               onChange={handleChange}
               onClick={handleChange} />
        <div className="query-input--option--container">
          <span className="query-input--option--body">{props.option}</span>
        </div>
      </label>
    </li>
  )
}

export default Option
