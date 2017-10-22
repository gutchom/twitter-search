import Logger from 'app/stores/Logger'
import * as assert from 'power-assert'

function data(num: number): number[] {
  return [++num, ++num, ++num]
}

describe('Logger.ts', function() {
  describe('should', function() {
    it('save and load data', function() {
      const logger = new Logger('test', 1)

      logger.save(data(0))

      assert.deepEqual(logger.load(), data(0))
    })

    it('undo history', () => {
      const logger = new Logger('test', 1)

      logger
        .save(data(0))
        .save(data(1))
        .save(data(2))
        .save(data(3))

      logger.undo()

      assert.deepEqual(logger.load(), data(2))
    })

    it('redo history', function() {
      const logger = new Logger('test', 1)

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
      const logger = new Logger('test', 1)

      logger.save(data(0))
      logger.save(data(1))
      const stamp = logger.stamp
      logger.save(data(2))
      logger.save(data(3))

      logger.jump(stamp)

      assert.deepEqual(logger.load(), data(1))
    })
  })

  describe('with data on LocalStorage should', function() {
    beforeEach(function () {
      const logger = new Logger('test', 1, { useStorage: true })

      logger.save(data(999))
    })

    it('restore data from LocalStorage', function() {
      const logger = new Logger('test', 1)

      logger.restore()

      assert.deepEqual(logger.load(), data(999))
    })

    it('not save data on LocalStorage without option', function() {
      const logger = new Logger('test', 1)

      logger.save(data(1)).empty().restore()

      assert.deepEqual(logger.load(), data(999))
    })

    it('remove LocalStorage data with later version', function() {
      const logger = new Logger('test', 1)
      const later = new Logger('test', 2)

      later.restore()
      logger.restore()

      assert(logger.length === 0)
    })

    it('not remove LocalStorage data with older version', function() {
      const logger = new Logger('test', 1)
      const older = new Logger('test', 0.1)

      older.restore()
      logger.restore()

      assert.deepEqual(logger.load(), data(999))
    })
  })

  describe('should throw error when', function() {
    it('load without history', function() {
      const logger = new Logger('test', 0, { range: 2 })

      assert.throws(function() {
        logger.load()
      })
    })

    it('cannot undo', function() {
      const logger = new Logger('test', 0, { range: 2 })

      assert.throws(function() {
        logger.save(data(0)).undo()
      })
    })


    it('cannot redo', function() {
      const logger = new Logger('test', 0, { range: 2 })

      assert.throws(function() {
        logger.save(data(0)).redo()
      })
    })

  })
})
