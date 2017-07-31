import React, { ChangeEvent, FocusEvent, KeyboardEvent } from 'react'
import { queryLogger } from 'app/stores'
import LoggedInputHintBox from './LoggedInputHintBox'

export interface AppProps {
  name: string
}

export interface AppState {
  query: string
  stampOnFocus: string
  stampToLatest: string
  visibleHints: boolean
}

class LoggedInput extends React.Component<AppProps, AppState> {
  hintBox: HTMLUListElement
  input: HTMLInputElement
  state = {
    query: 'gutchom',
    stampOnFocus: '',
    stampToLatest: '',
    visibleHints: false
  }

  constructor() {
    super()
    queryLogger.append('gutchom')
    queryLogger.append('hoge')
    queryLogger.append('fuga')
    queryLogger.append('nyas')
    queryLogger.append('test')
    queryLogger.append('nyan')
    queryLogger.append('foo')
    queryLogger.append('bar')
  }

  handleUndo = () => {
    queryLogger.undo(1)
    this.setState({
      query: queryLogger.current as string,
      visibleHints: true
    })
  }

  handleRedo = () => {
    queryLogger.redo(1)
    this.setState({
      query: queryLogger.current as string,
      visibleHints: true
    })
  }

  handleInputKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key)

    if (e.key.length === 1) return

    switch (e.key) {
      case 'Escape':
        queryLogger.jump(this.state.stampOnFocus)
        this.setState({
          query: queryLogger.current as string,
          visibleHints: false
        })
        ; (e.target as HTMLInputElement).blur()
        break

      case 'Enter':
        queryLogger.append((e.target as HTMLInputElement).value)
        this.setState({
          query: '',
          visibleHints: false
        })
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

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: e.target.value })
  }

  handleInputFocus = () => {
    queryLogger.latest()

    this.setState({
      query: queryLogger.current as string,
      stampOnFocus: queryLogger.stamp,
      visibleHints: true,
    })
  }

  handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (queryLogger.current !== (e.target as HTMLInputElement).value) {
      queryLogger.append((e.target as HTMLInputElement).value)
    }
  }

  handleSelect = (chosen: HTMLInputElement) => {
    console.log(this.hintBox)
    console.log('hintBox.scrollHeight', this.hintBox.scrollHeight)
    console.log('hintBox.scrollTop', this.hintBox.scrollTop)
    console.log('chosen.offsetTop', chosen.offsetTop)

    queryLogger.cursor = parseInt(chosen.value, 10)
    queryLogger.append(queryLogger.current)

    this.setState({
      query: queryLogger.current as string,
      visibleHints: false,
    })
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
                 onChange={this.handleInputChange} />
          <LoggedInputHintBox name={this.props.name}
                              hints={queryLogger.all.reverse()}
                              selecting={queryLogger.cursor}
                              visible={this.state.visibleHints}
                              handleSelect={this.handleSelect}
                              hintBoxRef={(el: HTMLUListElement) => this.hintBox = el} />
        </div>
        <button onClick={this.handleUndo}>Undo</button>
        <button onClick={this.handleRedo}>Redo</button>
      </div>
    )
  }
}

export default LoggedInput
