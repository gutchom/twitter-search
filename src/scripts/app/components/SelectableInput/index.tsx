import React, { ChangeEvent, FocusEvent, KeyboardEvent } from 'react'
import Drawer from './Drawer'

export interface SelectableInputProps {
  defaults?: string[]
  focus: boolean
  choices: string[]
  onChange(keywords: string[]): void
}

export interface SelectableInputState {
  isDrawerOpen: boolean
  cursor: number
  input: string
}

export default class SelectableInput extends React.Component<SelectableInputProps, SelectableInputState> {
  kanaInput = false
  input: HTMLInputElement
  drawer: HTMLUListElement

  state = {
    isDrawerOpen: false,
    cursor: 0,
    input: (this.props.defaults || []).join(' '),
  }

  get cursor(): number { return this.state.cursor }

  set cursor(next: number) {
    const cursor = next > this.props.choices.length ? this.props.choices.length : next > 0 ? next : 0

    if (this.props.choices.length > 0 && cursor > 1) {
      const item = this.drawer.children[cursor - 1] as HTMLLIElement
      const positionBottom = item.offsetTop + item.offsetHeight - this.drawer.offsetHeight

      if (this.drawer.scrollTop < positionBottom) {
        this.drawer.scrollTo(0, positionBottom)
      }
      if (this.drawer.scrollTop > item.offsetTop) {
        this.drawer.scrollTo(0, item.offsetTop)
      }
    }

    this.setState({ cursor, isDrawerOpen: this.props.choices.length > 0 && cursor > 0 })
  }

  componentDidMount() {
    if (this.props.focus) {
      this.input.focus()
    }
  }

  handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    this.setState({
      isDrawerOpen: true,
      input: e.currentTarget.value,
    })
  }

  handleInputBlur = () => {
    const keywords = this.state.input.split(/[\s\u3000]/).filter(phrase => phrase.length > 0)
    const input = keywords.length > 0 ? keywords.join(' ') + ' ' : keywords.join(' ')

    this.setState({ input, isDrawerOpen: false })
    this.props.onChange(keywords)
  }

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      input: e.target.value,
    })
  }

  handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    this.kanaInput = e.keyCode === 229 || this.kanaInput && e.key !== 'Enter' && e.key !== 'Escape'

    if (!this.kanaInput) {
      switch (e.key) {
        case 'Enter':
        case 'Escape':
          this.input.blur()
          break

        case 'Space':
          if (this.cursor > 0) {
            this.handleDrawerChange(this.cursor)
          }
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
  }

  handleDrawerChange = (cursor: number) => {
    this.input.focus()
    const keywords = this.state.input.split(/[\s\u3000]/)
    const restored = this.props.choices[this.props.choices.length - cursor]
    const filtered = keywords.filter(word => word !== restored)
    const input = filtered.length < keywords.length ? filtered.join(' ') : filtered.concat(restored).join(' ')

    this.setState({ input })
  }

  inputRefs = (el: HTMLInputElement) => {
    this.input = el
  }

  drawerRefs = (el: HTMLUListElement) => {
    this.drawer = el
  }

  render() {
    return (
      <div className="query-input">
        <input
          className="textinput" placeholder="スペース区切りで複数入力"
          value={this.state.input}
          onBlur={this.handleInputBlur}
          onFocus={this.handleInputFocus}
          onChange={this.handleInputChange}
          onKeyDown={this.handleInputKeyDown}
          ref={this.inputRefs}
        />
        <Drawer
          refs={this.drawerRefs}
          visible={this.state.isDrawerOpen}
          options={[...this.props.choices].reverse()}
          selected={this.state.input.split(/[\s\u3000]/)}
          focusing={this.state.cursor}
          onChange={this.handleDrawerChange}
        />
      </div>
    )
  }
}
