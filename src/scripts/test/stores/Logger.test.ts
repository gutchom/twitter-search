import Logger from 'app/stores/Logger'
import * as assert from 'power-assert'

describe('Logger.ts', () => {
  const first  = { ids: [1, 2, 3] }
  const second = { ids: [2, 3, 4] }
  const third  = { ids: [3, 4, 5] }
  const fourth = { ids: [4, 5, 6] }

  it('undo history', () => {
    const logger = new Logger('test', '0.0')

    logger.save(first)
    logger.save(second)
    logger.save(third)
    logger.save(fourth)

    logger.undo()

    assert.deepEqual(logger.load(), third)
  })

  it('redo history', () => {
    const logger = new Logger('test', '0.0')

    logger.save(first)
    logger.save(second)
    logger.save(third)
    logger.save(fourth)

    logger.undo()
    logger.undo()
    logger.redo()

    assert.deepEqual(logger.load(), third)
  })

  it('jump to stamped point', () => {
    const logger = new Logger('test', '0.0')

    logger.save(first)
    logger.save(second)
    const stamp = logger.stamp
    logger.save(third)
    logger.save(fourth)

    logger.jump(stamp)

    assert.deepEqual(logger.load(), second)
  })
})
