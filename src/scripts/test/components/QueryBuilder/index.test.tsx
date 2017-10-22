import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as assert from 'power-assert'
import QueryBuilder from 'app/components/QueryBuilder'

Enzyme.configure({ adapter: new Adapter() })

describe('QueryBuilder.tsx', () => {
  it('should have a default QueryTerm', () => {
    const wrapper = shallow(<QueryBuilder />)

    assert.strictEqual(wrapper.find('QueryTerm').length, 1)
  })
})
