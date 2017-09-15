const PREFIX = 'history-'
const min = 1

export interface History<T> {
  readonly name: string
  readonly length: number
  readonly stamp: string
  readonly latest: T
  readonly oldest: T
  readonly all: T[]
  depth: number
  undo(steps: number): T
  redo(steps: number): T
  load(depth: number): T
  jump(stamp: string): void
  save(data: T): void
  restore(): void
}

export interface LoggerOptions {
  duration?: number
  size?: number
}

export interface Log {
  stamp: string
  data: string
}

export interface Archive {
  version: string
  timestamp: number
  history: Log[]
  depth: number
}

/**
 * @classdesc State logger with a traversable history
 * @constructor
 * @param {string} name - Identifier key within "Local Storage"
 * @param {string} version - Unique value given to each log data definitions
 * @param {Object} options - Options
 * @param {number} options.size - Maximum number to keep logs
 * @param {number} options.duration - Hours to keep logs
 */
export default class Logger<T> implements History<T> {
  key: string
  version: string
  private history: Log[] = []
  private position = min
  private size = 20
  private duration = Infinity
  private hasStorage = false

  constructor(name: string, version: string, options?: LoggerOptions) {
    this.key = PREFIX + name
    this.version = version

    if (typeof options !== 'undefined') {
      if (typeof options.size !== 'undefined') { this.size = options.size }
      if (typeof options.duration !== 'undefined') { this.duration = options.duration }
    }

    try {
      if (typeof window.localStorage === 'undefined') { this.hasStorage = false }
      const x = '__storage_test__'
      localStorage.setItem(x, x)
      localStorage.removeItem(x)
      this.hasStorage = true
    } catch (err) {
      this.hasStorage = false
    }
  }

  get name(): string { return this.key.slice(PREFIX.length) }

  get length(): number { return this.history.length }

  get depth(): number { return this.position }

  set depth(next) { this.position = next > this.length ? this.length : next < min ? min : next }

  get latest(): T { return this.load(min) }

  get oldest(): T { return this.load(this.length) }

  get all(): T[] { return this.history.map(log => JSON.parse(log.data)) }

  get stamp(): string { return this.history[this.length - this.depth].stamp }

  undo(steps = 1): T { return this.load(this.depth += steps) }

  redo(steps = 1): T { return this.load(this.depth -= steps) }

  load(depth = this.depth): T {
    if (this.length === 0) {
      throw new Error(`The history of logger "${this.name}" is empty.`)
    } else {
      return JSON.parse(this.history[this.length - depth].data)
    }
  }

  jump(stamp: string): void {
    const index = this.history.findIndex(log => log.stamp === stamp)
    if (index !== -1) { this.depth = this.length - index }
  }

  save(data: T): void {
    this.history = this.history
      .slice(-this.size, this.length - this.depth + 1)
      .concat({
        stamp: Date.now().toString(10) + this.length.toString(10),
        data: JSON.stringify(data),
      })
    this.depth = min

    if (!this.hasStorage) { return }

    localStorage.setItem(this.key, JSON.stringify({
      version: this.version,
      timestamp: Date.now(),
      history: this.history,
      depth: this.depth,
    } as Archive))
  }

  restore(): void {
    if (this.hasStorage) { return }

    const json = localStorage.getItem(this.key)

    if (!json) { return }

    const archive: Archive = JSON.parse(json)

    if (archive.version !== this.version) {
      localStorage.removeItem(this.key)
      return
    }

    if (Date.now() - archive.timestamp > this.duration * 60 * 60 * 1000) {
      localStorage.removeItem(this.key)
      return
    }

    this.history.splice(0, this.length, ...archive.history)
    this.depth = archive.depth
  }
}
