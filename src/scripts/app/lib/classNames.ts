export default function classNames(...classList: (string|{[key: string]: any})[]): string {
  return classList
    .map(className => typeof className === 'object'
      ? Object.keys(className).filter(key => !!(className[key])).join(' ')
      : className)
    .join(' ')
}
