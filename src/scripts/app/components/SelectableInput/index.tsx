import React, { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from 'react'
import Drawer from './Drawer'

export interface SelectableInputProps {
  defaults?: string[]
  focus: boolean
  options: string[]
  onChange(keywords: string[]): void
}

export interface SelectableInputState {
  cursor: number
  input: string
  inputOnFocus: string
  isDrawerOpen: boolean
}

export default class SelectableInput extends React.Component<SelectableInputProps, SelectableInputState> {
  hasPressed = false
  input: HTMLInputElement
  drawer: HTMLUListElement
  state = {
    cursor: 0,
    input: (this.props.defaults || []).join(' '),
    inputOnFocus: '',
    isDrawerOpen: false,
  }

  get cursor(): number { return this.state.cursor }

  set cursor(next: number) {
    const length = this.props.options.length
    const cursor = next > length ? length : next > 0 ? next : 0
    const input = cursor > 0 ? this.props.options[length - cursor] : this.state.inputOnFocus
    const isDrawerOpen = length > 0 && cursor > 0

    if (isDrawerOpen) {
      const item = this.drawer.children[cursor - 1] as HTMLLIElement
      this.drawer.scrollTop = item.offsetTop + item.offsetHeight - this.drawer.offsetHeight
    } else {
      this.drawer.scrollTop = 0
    }

    this.setState({ cursor, input, isDrawerOpen })
    this.handleChange(input)
  }

  componentDidMount() {
    document.body.addEventListener('click', this.handleBodyClick, false)
    this.input.addEventListener('click', this.handleInputClick, false)
    this.props.focus && this.input.focus()
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleBodyClick)
    this.input.removeEventListener('click', this.handleInputClick)
  }

  handleBodyClick = () => {
    this.setState({ isDrawerOpen: false })
  }

  handleInputClick = (e: Event) => {
    e.stopPropagation()
  }

  handleChange = (input: string) => {
    this.props.onChange(input.replace(/(\s+|　)/g, ' ').split(/\s/))
  }

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: e.target.value })
  }

  handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    this.setState({
      inputOnFocus: (e.target as HTMLInputElement).value,
      isDrawerOpen: (this.props.options.length > 0),
    })
  }

  handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    const input = (e.target as HTMLInputElement).value

    this.setState({ input, isDrawerOpen: false })
    this.handleChange(input)
  }

  handleInputKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length === 1) { return }

    switch (e.key) {
      case 'Escape':
        this.setState({ input: this.state.inputOnFocus, isDrawerOpen: false })
        this.input.blur()
        break

      case 'Enter':
        if (this.hasPressed) {
          this.handleChange(this.state.input)
          this.input.blur()
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

    this.hasPressed = false
  }

  handleSelect = (cursor: number) => {
    const input = this.props.options[this.props.options.length - cursor]

    this.setState({ cursor, input, isDrawerOpen: false })
    this.handleChange(input)
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
               onKeyPress={() => this.hasPressed = true}
               onKeyUp={this.handleInputKeyUp}
               ref={this.inputRefs} />

        <Drawer visible={this.state.isDrawerOpen}
                options={[...this.props.options].reverse()}
                chosen={this.state.cursor}
                onChange={this.handleSelect}
                refs={this.drawerRefs} />
      </div>
    )
  }
}
