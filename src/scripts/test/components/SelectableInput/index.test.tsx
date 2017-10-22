import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as assert from 'power-assert'
import SelectableInput from 'app/components/SelectableInput'

Enzyme.configure({ adapter: new Adapter() })

function handleChange(keywords: string[]): void {}

describe('SelectableInput.tsx', () => {
  it('has correct default text', () => {
    const defaults = ['foo', 'bar']
    const wrapper = mount(
      <SelectableInput
        defaults={defaults}
        focus={true}
        choices={defaults}
        onChange={handleChange}
      />)

    assert.strictEqual(wrapper.state('input'), defaults.join(' '))
  })
})
