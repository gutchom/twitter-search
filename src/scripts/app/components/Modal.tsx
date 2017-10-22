import React, { MouseEvent, ReactNode } from 'react'

export interface ModalProps {
  className?: string
  header?: ReactNode
  footer?: ReactNode
  visible: boolean
  onClose(e: MouseEvent<HTMLButtonElement>): void
}

export default class Modal extends React.Component<ModalProps, {}> {
  root: HTMLDivElement
  content: HTMLDivElement
  rootScrollPosition: number

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
    const bottom = this.content.scrollHeight - this.content.clientHeight

    if (this.props.visible) {
      if (isModal(e.target, this.root)) {
        e.stopPropagation()
      } else if (this.content.scrollTop === 0 || this.content.scrollTop === bottom) {
        e.preventDefault()
      }
    }

    function isModal(target: EventTarget, ref: HTMLDivElement): boolean {
      if (target instanceof HTMLElement) {
        if (target === ref) {
          return true
        } else if (target.parentElement) {
          return isModal(target.parentElement, ref)
        }
      }
      return false
    }
  }

  handleCloseClick = (e: MouseEvent<HTMLButtonElement>) => {
    window.scrollTo(0, this.rootScrollPosition)
    this.props.onClose(e)
  }

  rootRef = (el: HTMLDivElement) => {
    this.root = el
  }

  contentRef = (el: HTMLDivElement) => {
    this.content = el
  }

  render() {
    return (
      <div ref={this.rootRef} className={`modal ${this.props.className ? this.props.className : ''} ${this.props.visible ? 'visible' : ''}`}>
        <div className="modal--window">
          <div className="modal--content" ref={this.contentRef}>
            {this.props.header && <div className="modal--spacer" />}

            {this.props.children}

            {this.props.footer && <div className="modal--spacer" />}
          </div>
          {this.props.header && <header>{this.props.header}</header>}
          {this.props.footer && <footer>{this.props.footer}</footer>}
          <button className="modal--close" onClick={this.handleCloseClick}>
            <i className="fa fa-times" aria-hidden="true" />
          </button>
        </div>
      </div>
    )
  }
}
