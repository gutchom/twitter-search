import React from 'react'
import * as assert from 'power-assert'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Modal from 'app/components/Modal'

Enzyme.configure({ adapter: new Adapter() })

describe('Modal.tsx', function () {
  it('should have children', function () {
    const wrapper = mount(
      <Modal
        visible={true}
        onClose={() => {}}
      >
        <p>Sample text.</p><p>Sample text.</p>
      </Modal>)

    assert(wrapper.find('.modal--content').children().find('p').length === 2)
  })

  it('should have header', function () {
    const header = <span>header</span>
    const wrapper = mount(
      <Modal
        visible={true}
        onClose={() => {}}
        header={header}
      >
        <p>Sample text.</p>
      </Modal>)

    assert(wrapper.containsMatchingElement(header))
  })

  it('should have footer', function () {
    const footer = <span>footer</span>
    const wrapper = mount(
      <Modal
        visible={true}
        onClose={() => {}}
        footer={footer}
      >
        <p>Sample text.</p>
      </Modal>)

    assert(wrapper.containsMatchingElement(footer))
  })

  it('should switch class name', function () {
    let isOpen = true
    const wrapper = mount(
      <Modal
        visible={isOpen}
        onClose={() => { wrapper.setProps({ visible: isOpen = !isOpen }) }}
      >
        <p>Sample text.</p><p>Sample text.</p>
      </Modal>)

    assert(wrapper.getDOMNode().classList.contains('modal--visible'))

    wrapper.find('.modal--close').simulate('click')

    assert(!wrapper.getDOMNode().classList.contains('modal--visible'))
  })
})
