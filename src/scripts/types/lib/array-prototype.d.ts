interface Array<T> {
  /**
   * Remove duplicate element from Array.
   * @param comparison Describe expression to compare each element with every element.
   */
  dedupe(comparison?: ((val1: T, val2: T) => boolean)): T[]
  dedupeByKey(...key: string[]): T[]
  sortByKey(...key: string[]): T[]
}
