declare module 'array-unique' {
  function unique<T>(array: T[]): T[]
  function immutable<T>(array: T[]): T[]

  export default unique
  export { immutable }
}
