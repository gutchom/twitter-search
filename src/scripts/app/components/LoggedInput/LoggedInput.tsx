import React, { ChangeEvent, KeyboardEvent } from 'react'
import { queryLogger } from 'app/stores'
import LoggedInputHintBox from './LoggedInputHintBox'

export interface AppProps {
  name: string
}

export interface AppState {
  query: string
  stampOnFocus: string
  stampToLatest: string
  historyVisibility: boolean
}

class LoggedInput extends React.Component<AppProps, AppState> {
  input: HTMLInputElement
  state = {
    query: 'gutchom',
    stampOnFocus: '',
    stampToLatest: '',
    historyVisibility: false,
  }

  constructor() {
    super()
    queryLogger.append('gutchom')
  }

  componentDidMount() {
    document.body.addEventListener('click', () => {
      this.setState({ historyVisibility: false })
    }, false)

    this.input.addEventListener('click', (e) => {
      e.stopPropagation()
    }, true)
  }

  handleUndo = () => {
    queryLogger.undo(1)

    this.setState({
      query: queryLogger.current as string,
      historyVisibility: true,
    })
  }

  handleRedo = () => {
    queryLogger.redo(1)

    this.setState({
      query: queryLogger.current as string,
      historyVisibility: true,
    })
  }

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: e.target.value })
  }

  handleInputFocus = () => {
    queryLogger.latest()

    this.setState({
      query: queryLogger.current as string,
      stampOnFocus: queryLogger.stamp,
    })
  }

  handleInputBlur = () => {
    if (this.input.value.length === 0 || /^\s+$/.test(this.input.value)) return

    if (queryLogger.current !== this.input.value) queryLogger.append(this.input.value)
  }

  handleInputKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key)

    if (e.key.length === 1) return

    switch (e.key) {
      case 'Escape':
        queryLogger.jump(this.state.stampOnFocus)

        this.setState({
          query: queryLogger.current as string,
          historyVisibility: false,
        })

        this.input.blur()

        break

      case 'Enter':
        if (this.input.value.length === 0 || /^\s+$/.test(this.input.value)) break

        queryLogger.append(this.input.value)

        this.setState({ query: '' })

        break

      case 'ArrowUp':
        this.handleRedo()

        break

      case 'ArrowDown':
        this.handleUndo()

        break

      default:
        break
    }
  }

  handleSelect = (cursor: number) => {
    queryLogger.cursor = cursor
    queryLogger.append(queryLogger.current)

    this.setState({
      query: queryLogger.current as string,
      historyVisibility: false,
    })
  }

  handleScroll = (offset: number, hintBox: HTMLUListElement) => {
    console.log(offset)
    console.log(hintBox.scrollHeight)
    console.log(hintBox.scrollTop)
  }

  render() {
    return (
      <div className="query-input">
        <div className="text-input">
          <input type="text"
                 value={this.state.query}
                 onKeyUp={this.handleInputKeyUp}
                 onFocus={this.handleInputFocus}
                 onBlur={this.handleInputBlur}
                 onChange={this.handleInputChange}
                 ref={(input: HTMLInputElement) => this.input = input} />
          <LoggedInputHintBox visible={this.state.historyVisibility}
                              name={this.props.name}
                              hints={queryLogger.all.reverse()}
                              selecting={queryLogger.cursor}
                              handleSelect={this.handleSelect}
                              handleScroll={this.handleScroll} />
        </div>
        <button onClick={this.handleUndo}>Undo</button>
        <button onClick={this.handleRedo}>Redo</button>
      </div>
    )
  }
}

export default LoggedInput
