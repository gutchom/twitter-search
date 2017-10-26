interface Array<T> {
  dedupe(comparison?: ((val1: T, val2: T) => boolean)|string, ...key: string[]): T[]
  sortByKey(...key: string[]): T[]
}
