export default function equal<T>(a: T, b: T): boolean {
  return typeof a === 'object' ? Object.keys(a).every(<K extends keyof T>(key: K) => equal(a[key], b[key])) : a === b
}
