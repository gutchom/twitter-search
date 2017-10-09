import React from 'react'
import * as assert from 'power-assert'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Modal from 'app/components/Modal'

Enzyme.configure({ adapter: new Adapter() })

let isOpen = true
function handleCancel() { isOpen = false }

describe('Modal.tsx', function () {
  it('has children component', function () {
    const wrapper = mount(<Modal visible={isOpen} onClose={handleCancel}><p>Sample text.</p><p>Sample text.</p></Modal>)

    assert.strictEqual(wrapper.find('p').length, 2)
  })

  it('has header component', function () {
    const wrapper = mount(
      <Modal visible={isOpen}
             onClose={handleCancel}
             header={<span>header</span>}>
        <p>Sample text.</p></Modal>)

    assert.strictEqual(wrapper.find('header').length, 1)
  })

  it('has footer component', function () {
    const wrapper = mount(
      <Modal visible={isOpen}
             onClose={handleCancel}
             footer={<span>footer</span>}>
        <p>Sample text.</p></Modal>)

    assert.strictEqual(wrapper.find('footer').length, 1)
  })
})
