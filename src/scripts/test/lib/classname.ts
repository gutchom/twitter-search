import classname from 'app/lib/classname'
import * as assert from 'power-assert'

describe('classNames.ts', function() {
  describe('classNames() should', function() {
    it('join strings', function() {
      assert(classname('foo', 'bar') === 'foo bar')
    })

    it('make string from object key avoid falsy property', function() {
      assert(classname({ foo: true, bar: !!0 }) === 'foo')
    })

    it('make string from mixed arguments', function() {
      assert(classname('foo', { bar: true }) === 'foo bar')
    })
  })
})
