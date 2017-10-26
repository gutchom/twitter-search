import equal from 'app/lib/equal'

Array.prototype.dedupe = function dedupe<T>(comparison?: ((val1: T, val2: T) => boolean)|string, ...key: string[]): T[] {
  if (typeof comparison === 'string') {
    key.unshift(comparison)
  }
  return (this as T[]).filter(
    (val1, index, self) => typeof comparison === 'function'
      ? -1 > self.findIndex(val2 => comparison(val1, val2))
      : typeof comparison === 'string'
        ? index <= self.findIndex(val2 => key.reduce(refer, val1) === key.reduce(refer, val2))
        : index <= self.findIndex(val2 => equal(val1, val2))
  )
}

Array.prototype.sortByKey =  function sortByKey<T>(...key: string[]): T[] {
  if (typeof this[0] !== 'object') {
    throw new TypeError('This array have to made of object.')
  }

  return this.sort((a: T, b: T) => (a = key.reduce(refer, a) as any) < (b = key.reduce(refer, b) as any) ? -1 : a > b ? 1 : 0)
}

export function refer<T, K extends keyof T>(variable: T, property: K): T[K] {
  return variable[property]
}
