import classNames from 'app/lib/classNames'
import * as assert from 'power-assert'

describe('classNames.ts', function() {
  describe('classNames() should', function() {
    it('join strings', function() {
      assert(classNames('foo', 'bar') === 'foo bar')
    })

    it('make string from object key avoid falsy property', function() {
      assert(classNames({ foo: true, bar: 0 }) === 'foo')
    })

    it('make string from mixed arguments', function() {
      assert(classNames('foo', { bar: true }) === 'foo bar')
    })
  })
})
