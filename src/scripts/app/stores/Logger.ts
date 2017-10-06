const prefix = 'history-'

export interface Log {
  data: string
  stamp: string
}

export interface Archive {
  depth: number
  history: Log[]
  version: string
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
  jump(stamp: string): boolean
  undo(steps: number): T
  redo(steps: number): T
  load(depth: number): T
  save(data: T): this
  empty(): this
  restore(): boolean
}

/**
 * @classdesc State logger with a traversable history
 * @constructor
 * @param {string} name - unique key within "Local Storage"
 * @param {string} version - identifier of log format
 * @param {Object} options
 * @param {number} options.size - max length of history
 * @param {number} options.duration - hours to keep history on LocalStorage
 */
export default class Logger<T> implements History<T> {
  private key: string
  private version: string
  private size = Infinity
  private duration = Infinity
  private hasStorage = false
  private position = 0
  private history: Log[] = []

  constructor(name: string, version: string, options?: { duration?: number, size?: number }) {
    this.key = prefix + name
    this.version = version

    if (typeof options !== 'undefined') {
      if (typeof options.size === 'number') { this.size = options.size }
      if (typeof options.duration === 'number') { this.duration = options.duration }
    }

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
    return this.history.map(log => JSON.parse(log.data))
  }

  get depth(): number {
    return this.length - this.cursor
  }

  set depth(next) {
    this.cursor = this.length - next
  }

  private get cursor(): number {
    return this.position
  }

  private set cursor(next) {
    this.position = next >= this.length ? this.length - 1 : next >= 0 ? next : 0
  }

  undo(steps = 1): T {
    return this.load(this.depth += steps)
  }

  redo(steps = 1): T {
    return this.load(this.depth -= steps)
  }

  jump(stamp: string): boolean {
    const index = this.history.findIndex(log => log.stamp === stamp)

    return (index !== -1 && !!(this.cursor = index) || true)
  }

  /**
   * @param {number} depth - 1 <= depth <= this.length
   * @returns {T}
   */
  load(depth = this.depth): T {
    if (this.length === 0) {
      throw new Error(`Logger "${this.name}" has no history.`)
    } else {
      return JSON.parse(this.history[this.length - depth].data)
    }
  }

  save(data: T): this {
    this.history = this.history
      .slice(-this.size - this.depth, this.cursor + 1)
      .concat({
        data: JSON.stringify(data),
        stamp: Date.now().toString(10) + this.history.length.toString(10),
      })

    this.depth = 1

    if (this.hasStorage) {
      localStorage.setItem(this.key, JSON.stringify({
        depth: this.depth,
        history: this.history,
        version: this.version,
        timestamp: Date.now(),
      } as Archive))
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

    if (archive.version !== this.version || Date.now() - archive.timestamp > this.duration * 60 * 60 * 1000) {
      localStorage.removeItem(this.key)

      return false
    }

    this.history = archive.history.slice(-this.size)
    this.depth = archive.depth

    return true
  }
}
