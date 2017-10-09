import React, { MouseEvent, ReactNode } from 'react'

export interface ModalProps {
  className?: string|string[]
  header?: ReactNode
  footer?: ReactNode
  visible: boolean
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
    if (nextProps.visible !== this.props.visible) {
      if (nextProps.visible) {
        this.content.scrollTo(0, 1)
        this.rootScrollPosition = document.body.scrollTop || document.documentElement.scrollTop
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.preventBehindScroll)
    this.content.removeEventListener('scroll', this.adjustScroll)
  }

  adjustScroll = () => {
    const bottom = this.content.scrollHeight - this.content.clientHeight

    if (this.content.scrollTop === 0) {
      this.content.scrollTo(0, 1)
    }
    if (this.content.scrollTop === bottom) {
      this.content.scrollTo(0, bottom - 1)
    }
  }

  preventBehindScroll = (e: TouchEvent) => {
    const scrollTop = this.content.scrollTop
    const bottom = this.content.scrollHeight - this.content.clientHeight

    if (this.props.visible) {
      if (isModal(e.currentTarget as HTMLElement|Window)) {
        e.stopPropagation()
      } else if (scrollTop === 0 || scrollTop === bottom) {
        e.preventDefault()
      }
    }

    function isModal(el: HTMLElement|Window) {
      while (el instanceof HTMLElement && el.parentElement !== null) {
        if (el.classList.contains('modal')) { return true }
        el = el.parentElement
      }
      return false
    }
  }

  handleCloseClick = (e: MouseEvent<HTMLButtonElement>) => {
    window.scrollTo(0, this.rootScrollPosition)
    this.props.onClose(e)
  }

  ref = (el: HTMLDivElement) => {
    this.content = el
  }

  render() {
    return (
      <div className={this.classNames('modal', this.props.visible ? 'visible' : '').join(' ')}>
        <div className="modal--window">
          <div className="modal--content" ref={this.ref}>
            {this.props.header && <div className="modal--spacer"/>}

            {this.props.children}

            {this.props.footer && <div className="modal--spacer"/>}
          </div>
          {this.props.header && <header>{this.props.header}</header>}
          {this.props.footer && <footer>{this.props.footer}</footer>}
          <button className="modal--close" onClick={this.handleCloseClick}>
            <i className="fa fa-close"/>
          </button>
        </div>
      </div>
    )
  }
}
