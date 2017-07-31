import React from 'react'
import { shallow } from 'enzyme'
import * as assert from 'power-assert'
import App from 'app/components/App'

describe('App.tsx', () => {
  it('shallow', () => {
    const wrapper = shallow(<App />)
    assert.strictEqual(wrapper.find('HistoricalTextInput').length, 2)
  })
})
