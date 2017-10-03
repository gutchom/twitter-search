import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as assert from 'power-assert'
import QueryExpression from 'app/components/QueryExpression'

Enzyme.configure({ adapter: new Adapter() })

describe('QueryExpression.tsx', () => {
  it('has "QueryTerm"', () => {
    const wrapper = shallow(<QueryExpression />)
    assert.strictEqual(wrapper.find('QueryTerm').length, 1)
  })
})
