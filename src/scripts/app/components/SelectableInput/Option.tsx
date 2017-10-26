import React from 'react'
import classes from 'app/lib/classNames'

export interface OptionProps {
  text: string
  checked: boolean
  focusing: boolean
  position: number
  onChange(cursor: number): void
}

const Option: React.SFC<OptionProps> = props => (
  <li className="query-input--option">
    <label>
      <input
        className="checkbox"
        type="checkbox"
        tabIndex={-1}
        checked={props.checked}
        onChange={function() { props.onChange(props.position + 1) }}
      />
      <div className={classes('query-input--option--container', { focus: props.focusing })}>
        {props.text}
        </div>
    </label>
  </li>
)

export default Option
