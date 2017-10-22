const prefix = 'history-'

interface Log {
  data: string
  stamp: string
}

interface Archive {
  depth: number
  history: Log[]
  version: number
  timestamp: number
}

export interface History<T> {
  readonly name: string
  readonly length: number
  readonly stamp: string
  readonly canUndo: boolean
  readonly canRedo: boolean
  readonly all: T[]
  depth: number
  jump(stamp: string): number
  undo(steps: number): T
  redo(steps: number): T
  load(depth: number): T
  save(data: T): this
  empty(): this
  restore(): boolean
}

type LoggerOption = {
  range?: number
  duration?: number
  useStorage?: boolean
}

/**
 * @classdesc State logger with a traversable history
 * @constructor
 * @param {string} name - unique key within LocalStorage
 * @param {string} version - version of log format
 * @param {Object} options
 * @param {number} Infinity options.range - max length of history
 * @param {number} Infinity options.duration - hours to keep history on LocalStorage
 * @param {boolean} false options.useStorage
 */
export default class Logger<T> implements History<T> {
  private key: string
  private version: number
  private range = Infinity
  private duration = Infinity
  private hasStorage = false
  private useStorage = false
  private position = 0
  private history: Log[] = []

  constructor(name: string, version: number, options?: LoggerOption) {
    this.key = prefix + name
    this.version = version

    if (typeof localStorage === 'undefined') {
      this.hasStorage = false
    } else {
      try {
        localStorage.setItem('test', 'test')
        localStorage.removeItem('test')
        this.hasStorage = true
      } catch (err) {
        this.hasStorage = false
      }
    }

    if (typeof options === 'object') {
      if (options.useStorage) { this.useStorage = options.useStorage }
      if (typeof options.range === 'number') { this.range = options.range }
      if (typeof options.duration === 'number') { this.duration = options.duration }
    }
  }

  get name(): string {
    return this.key.slice(prefix.length)
  }

  get length(): number {
    return this.history.length
  }

  get stamp(): string {
    return this.history[this.cursor].stamp
  }

  get canUndo(): boolean {
    return this.length > 0 && this.depth < this.length
  }

  get canRedo(): boolean {
    return this.length > 0 && this.depth > 1
  }

  get all(): T[] {
    return this.length > 0 ? this.history.map(log => JSON.parse(log.data)) : []
  }

  get depth(): number {
    return this.length - this.cursor
  }

  set depth(next: number) {
    this.cursor = this.length - next
  }

  private get cursor(): number {
    return this.position
  }

  private set cursor(next: number) {
    this.position = next >= this.length ? this.length - 1 : next <= 0 ? 0 : next
  }

  undo(steps = 1): T {
    if (!this.canUndo) {
      throw new RangeError(`Logger "${this.name}" cannot undo any more.`)
    }
    return this.load(this.depth += steps)
  }

  redo(steps = 1): T {
    if (!this.canUndo) {
      throw new RangeError(`Logger "${this.name}" cannot redo any more.`)
    }
    return this.load(this.depth -= steps)
  }

  jump(stamp: string): number {
    const index = this.history.findIndex(log => log.stamp === stamp)
    if (index !== -1) {
      this.cursor = index
    }

    return this.depth
  }

  load(depth = this.depth): T {
    if (this.length === 0) {
      throw new RangeError(`Logger "${this.name}" has no history.`)
    }
    if (depth > this.length || depth < 0) {
      throw new RangeError(`Depth should be in  to ${this.length}`)
    }

    return JSON.parse(this.history[this.length - depth].data)
  }

  save(data: T): this {
    this.history = this.history
      .slice(this.cursor - this.range, this.cursor + 1)
      .concat({
        data: JSON.stringify(data),
        stamp: Date.now().toString(10) + this.length.toString(10),
      })

    this.depth = 1

    if (this.useStorage && this.hasStorage) {
      localStorage.setItem(this.key, JSON.stringify({
        depth: this.depth,
        history: this.history,
        version: this.version,
        timestamp: Date.now(),
      }))
    }

    return this
  }

  empty(): this {
    this.history = []
    this.position = 0

    return this
  }

  restore(): boolean {
    if (!this.hasStorage) { return false }

    const json = localStorage.getItem(this.key)

    if (!json) { return false }

    const archive = JSON.parse(json) as Archive

    if (this.version < archive.version) {
      return false
    }

    if (this.version > archive.version || Date.now() - archive.timestamp > this.duration * 60 * 60 * 1000) {
      localStorage.removeItem(this.key)

      return false
    }

    this.history = archive.history.slice(-this.range)
    this.depth = archive.depth

    return true
  }
}
