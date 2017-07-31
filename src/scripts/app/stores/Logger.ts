import moment from 'moment'

const PREFIX = 'log-'
const min = 1

export interface Log {
  data: string
  id: string
}

export interface Restored {
  version: string
  lastUpdated: number
  history: Log[]
  cursor: number
}

export interface ProcessLogger<T> {
  readonly current: T
  readonly stamp: string
  readonly currentIndex: number
  cursor: number
  jump(stamp: string): void
  undo(step: number): void
  redo(step: number): void
  latest(): void
  oldest(): void
  load(): void
  append(data: T): void
  overwrite(data: T): void
}

export default class Logger<T> implements ProcessLogger<T> {
  private noStorage: boolean = false
  private version: string
  private name: string
  private expireHours: number | undefined
  private history: Log[] = []
  private depth = min

  constructor(version: string, name: string, expireHours?: number) {
    this.version = version
    this.name = name
    this.expireHours = expireHours

    try {
      if (typeof window.sessionStorage === 'undefined') this.noStorage = true
      const x = '__storage_test__'
      localStorage.setItem(x, x)
      localStorage.removeItem(x)
      this.noStorage = false
    }
    catch (err) {
      this.noStorage = true
    }
  }

  get cursor(): number { return this.depth }

  set cursor(next) {
    this.depth = next > this.history.length ? this.history.length : next < min ? min : next
    this.save()
  }

  get currentIndex(): number { return this.history.length - this.cursor }

  get current(): T { return JSON.parse(this.history[this.currentIndex].data) }

  get all(): T[] { return this.history.map(log => JSON.parse(log.data)) }

  get stamp(): string { return this.history[this.currentIndex].id }

  jump(stamp: string): void {
    const index = this.history.findIndex(log => log.id === stamp)
    if (index > 0) this.cursor = this.history.length - index
  }

  latest(): void { this.cursor = min }

  oldest(): void { this.cursor = this.history.length }

  undo(step = 1): void { this.cursor += step > this.history.length ? this.history.length : step }

  redo(step = 1): void { this.cursor -= step < min ? min : step }

  append(data: T): void {
    this.history.push(this.format(data))
    this.latest()
  }

  overwrite(data: T): void {
    this.history = this.history.slice(0, this.currentIndex + 1).concat(this.format(data))
    this.cursor = min
  }

  load(): void {
    if (this.noStorage) return

    const json = localStorage.getItem(PREFIX + this.name)
    if (!json) return

    const restored: Restored = JSON.parse(json)

    if (restored.version !== this.version) {
      localStorage.removeItem(PREFIX + this.name)
      return
    }

    if (this.expireHours) {
      if (moment().diff(moment(restored.lastUpdated), 'hours', true) > this.expireHours) {
        localStorage.removeItem(PREFIX + this.name)
        return
      }
    }

    this.history = this.history.concat(restored.history)
    this.cursor = restored.cursor
  }

  private save(): void {
    if (this.noStorage) return

    const log = {
      version: this.version,
      lastUpdated: Date.now(),
      history: this.history,
      cursor: this.cursor,
    }

    localStorage.setItem(PREFIX + this.name, JSON.stringify(log))
  }

  private format(data: T): Log {
    const time = Date.now().toString(10)
    const json = JSON.stringify(data)

    return {
      data: json,
      id: json + time,
    }
  }
}
