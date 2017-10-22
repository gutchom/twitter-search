import Logger from 'app/stores/Logger'
import * as assert from 'power-assert'

function data(num: number): number[] {
  return [++num, ++num, ++num]
}

describe('Logger.ts', function() {
  beforeEach(function () {
    const logger = new Logger('storage', 'storage')
    logger.save(data(999))
  })

  it('undo history', () => {
    const logger = new Logger('test', 'test')

    logger
      .save(data(0))
      .save(data(1))
      .save(data(2))
      .save(data(3))

    logger.undo()

    assert.deepEqual(logger.load(), data(2))
  })

  it('redo history', function() {
    const logger = new Logger('test', 'test')

    logger
      .save(data(0))
      .save(data(1))
      .save(data(2))
      .save(data(3))

    logger.undo()
    logger.undo()
    logger.redo()

    assert.deepEqual(logger.load(), data(2))
  })

  it('jump to stamped point', function() {
    const logger = new Logger('test', 'test')

    logger.save(data(0))
    logger.save(data(1))
    const stamp = logger.stamp
    logger.save(data(2))
    logger.save(data(3))

    logger.jump(stamp)

    assert.deepEqual(logger.load(), data(1))
  })

  it('restore data from LocalStorage', function() {
    const logger = new Logger('storage', 'storage')

    logger.restore()

    assert.deepEqual(logger.load(), data(999))
  })

  it('remove LocalStorage data with different version', function() {
    const compatible1 = new Logger('storage', 'storage')
    const compatible2 = new Logger('storage', 'storage')
    const incompatible = new Logger('storage', 'test')

    compatible1.restore()

    assert.deepEqual(compatible1.load(), data(999))

    incompatible.restore()
    compatible2.restore()

    assert.strictEqual(compatible2.length, 0)
  })
})
