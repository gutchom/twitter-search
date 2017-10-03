import React, { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from 'react'
import HistoryList from './HistoryList'

export interface LoggedInputProps {
  defaultValue?: string[]
  history: string[]
  onChange(keywords: string): void
  onRemove(e: MouseEvent<HTMLButtonElement>): void
}

export interface LoggedInputState {
  query: string
  queryOnFocus: string
  queryOnBlur: string
  historyVisibility: boolean
  historyCursor: number
}

class LoggedInput extends React.Component<LoggedInputProps, LoggedInputState> {
  input: HTMLInputElement
  historyBox: HTMLUListElement
  state = {
    query: '',
    queryOnFocus: '',
    queryOnBlur: '',
    historyVisibility: false,
    historyCursor: 0,
  }

  constructor(props: LoggedInputProps) {
    super(props)

    this.state.query = (this.props.defaultValue || []).join(' ')
  }

  get cursor(): number {
    return this.state.historyCursor
  }

  set cursor(next: number) {
    const index = next > this.props.history.length
      ? this.props.history.length : next < 0
        ? 0 : next

    if (this.state.historyVisibility && index > 0) {
      const item = this.historyBox.children[index - 1] as HTMLLIElement
      this.historyBox.scrollTop = item.offsetTop + item.offsetHeight - this.historyBox.offsetHeight
    } else {
      this.historyBox.scrollTop = 0
    }

    this.props.onChange(next > 0
      ? this.props.history[this.props.history.length - index]
      : this.state.queryOnFocus)

    this.setState({
      query: next > 0
        ? this.props.history[this.props.history.length - index]
        : this.state.queryOnFocus,
      historyVisibility: next > 0 && (this.props.history.length > 0),
      historyCursor: index,
    })
  }

  componentDidMount() {
    document.body.addEventListener('click', this.handleBodyClick, false)

    this.input.addEventListener('click', this.handleInputClick, false)
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleBodyClick)

    this.input.removeEventListener('click', this.handleInputClick)
  }

  handleBodyClick = () => {
    this.setState({ historyVisibility: false })
  }

  handleInputClick = (e: Event) => {
    e.stopPropagation()
  }

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: e.target.value })
  }

  handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    this.setState({
      queryOnFocus: (e.target as HTMLInputElement).value,
      historyVisibility: (this.props.history.length > 0),
    })
  }

  handleInputBlur = () => {
    this.props.onChange(this.input.value)

    this.setState({
      query: this.input.value,
      queryOnBlur: this.input.value,
      historyVisibility: false,
    })
  }

  handleInputKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length === 1) { return }

    switch (e.key) {
      case 'Escape':
        this.setState({
          query: this.state.queryOnFocus,
          historyVisibility: false,
        })
        this.input.blur()
        break

      case 'Enter':
        break

      case 'ArrowUp':
        this.cursor--
        break

      case 'ArrowDown':
        this.cursor++
        break

      default:
        break
    }
  }

  handleSelect = (cursor: number) => {
    this.props.onChange(this.props.history[this.props.history.length - cursor])

    this.setState({
      query: this.props.history[this.props.history.length - cursor],
      historyVisibility: false,
    })
  }

  boxRef = (el: HTMLUListElement) => this.historyBox = el

  render() {
    return (
      <div className="query-input">
        <div className="text-input">
          <input placeholder="スペース区切りで複数入力可能"
                 value={this.state.query}
                 onChange={this.handleInputChange}
                 onFocus={this.handleInputFocus}
                 onBlur={this.handleInputBlur}
                 onKeyUp={this.handleInputKeyUp}
                 ref={(input: HTMLInputElement) => this.input = input} />
          <button className="query-input--remove" tabIndex={-1} onClick={this.props.onRemove}>
            <i className="fa fa-times"/>
          </button>
          <HistoryList visible={this.state.historyVisibility}
                       history={Array(...this.props.history).reverse()}
                       selecting={this.state.historyCursor}
                       boxRef={this.boxRef}
                       handleSelect={this.handleSelect} />
        </div>
      </div>
    )
  }
}

export default LoggedInput
