import React, { MouseEvent, ReactNode } from 'react'

export interface ModalProps {
  className?: string|string[]
  header?: ReactNode
  footer?: ReactNode
  isOpen: boolean
  onClose(e: MouseEvent<HTMLButtonElement>): void
}

export default class Modal extends React.Component<ModalProps, {}> {
  content: HTMLDivElement
  rootScrollPosition: number

  classNames(...names: string[]): string[] {
    return names
      .concat(typeof this.props.className === 'string'
        ? this.props.className.split(' ')
        : this.props.className instanceof Array
          ? this.props.className : [])
      .filter(name => name.length > 0)
  }

  componentDidMount() {
    window.addEventListener('touchmove', this.preventBehindScroll)
    this.content.addEventListener('scroll', this.adjustScroll)
  }

  componentWillReceiveProps(nextProps: ModalProps) {
    if (nextProps.isOpen === true) {
      this.content.scrollTop = 1
      this.rootScrollPosition = document.body.scrollTop || document.documentElement.scrollTop
    }
  }

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.preventBehindScroll)
    this.content.removeEventListener('scroll', this.adjustScroll)
  }

  adjustScroll = () => {
    const bottom = this.content.scrollHeight - this.content.clientHeight

    if (this.content.scrollTop === 0) { this.content.scrollTop = 1 }
    if (this.content.scrollTop === bottom) { this.content.scrollTop = bottom - 1 }
  }

  preventBehindScroll = (e: TouchEvent) => {
    const scrollTop = this.content.scrollTop
    const bottom = this.content.scrollHeight - this.content.clientHeight

    if (this.props.isOpen) {
      if (isModal(e.target as HTMLElement)) {
        e.stopPropagation()
      } else if (scrollTop === 0 || scrollTop === bottom) {
        e.preventDefault()
      }
    }

    function isModal(el: HTMLElement) {
      while (el.parentElement !== null) {
        if (el.classList.contains('modal')) { return true }
        el = el.parentElement
      }
      return false
    }
  }

  handleCloseClick = (e: MouseEvent<HTMLButtonElement>) => {
    scrollTo(0, this.rootScrollPosition)
    this.props.onClose(e)
  }

  ref = (el: HTMLDivElement) => {
    this.content = el
  }

  render() {
    return (
      <div className={this.classNames('modal', this.props.isOpen ? 'visible' : '').join(' ')}>

        {this.props.header && <header>{this.props.header}</header>}

        <div className="modal--content" ref={this.ref}>
          {this.props.header && <div className="modal--spacer"/>}

          {this.props.children}

          {this.props.footer && <div className="modal--spacer"/>}
        </div>

        {this.props.footer && <footer>{this.props.footer}</footer>}

        <button className="modal--close" onClick={this.handleCloseClick}>
          <i className="fa fa-close"/>
        </button>

      </div>
    )
  }
}
