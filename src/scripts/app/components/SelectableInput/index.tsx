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
    const length = this.props.choices.length
    const cursor = next > length ? length : next > 0 ? next : 0

    if (length > 0 && cursor > 1) {
      const item = this.drawer.children[cursor - 1] as HTMLLIElement
      this.drawer.scrollTo(0, item.offsetTop + item.offsetHeight - this.drawer.offsetHeight)
    } else {
      this.drawer.scrollTo(0, 0)
    }

    this.setState({ cursor, isDrawerOpen: length > 0 && cursor > 0 })
  }

  componentDidMount() {
    this.input.addEventListener('click', this.handleInputClick)
    this.props.focus && this.input.focus()
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleBodyClick)
    this.input.removeEventListener('click', this.handleInputClick)
  }

  handleSubmit = (input = this.state.input, cursor = this.cursor, isDrawerOpen = false) => {
    const keywords = input.split(/[\s\u3000]/).filter(phrase => phrase.length > 0)
    this.setState({ input: `${keywords.join(' ')} `, cursor, isDrawerOpen })
    this.props.onChange(keywords)
  }

  handleBodyClick = () => {
    this.handleSubmit(this.state.input)
  }

  handleInputClick = (e: MouseEvent) => {
    e.stopPropagation()
  }

  handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    document.body.addEventListener('click', this.handleBodyClick)
    this.setState({
      isDrawerOpen: true,
      input: e.currentTarget.value,
    })
  }

  handleInputBlur = () => {
    document.body.removeEventListener('click', this.handleBodyClick)
    this.handleSubmit()
  }

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      input: e.target.value,
      cursor: 0,
    })
  }

  handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    this.kanaInput = e.keyCode === 229 ? true : this.kanaInput && e.keyCode !== 13 && e.keyCode !== 27

    if (!this.kanaInput) {
      switch (e.keyCode) {
        case 13: // Enter
        case 27: // Escape
          this.input.blur()
          break

        case 32: // Space
          if (this.cursor > 0) {
            this.handleDrawerClick(this.cursor)
          }
          break

        case 38: // ArrowUp
          this.cursor--
          break

        case 40: // ArrowDown
          this.cursor++
          break

        default:
          break
      }
    }
  }

  handleDrawerClick = (cursor: number) => {
    this.input.focus()
    const keywords = this.state.input.split(/[\s\u3000]/)
    const restored = this.props.choices[this.props.choices.length - cursor]
    const filtered = keywords.filter(word => word !== restored)

    this.setState({
      cursor,
      input: `${filtered.length < keywords.length ? filtered.join(' ') : filtered.concat(restored).join(' ')} `,
    })
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
        <input className="textinput" placeholder="スペース区切りで複数入力"
               value={this.state.input}
               onChange={this.handleInputChange}
               onFocus={this.handleInputFocus}
               onBlur={this.handleInputBlur}
               onKeyDown={this.handleInputKeyDown}
               ref={this.inputRefs} />

        <Drawer refs={this.drawerRefs}
                visible={this.state.isDrawerOpen}
                options={[...this.props.options].reverse()}
                selected={this.state.input.split(' ')}
                focusing={this.state.cursor}
                onClick={this.handleDrawerClick} />
      </div>
    )
  }
}
