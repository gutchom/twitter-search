export default function classname(...classList: (string|{[key: string]: boolean})[]): string {
  return classList
    .map(classname => typeof classname === 'object'
      ? Object.keys(classname).filter(key => classname[key])
      : classname)
    .join(' ')
}
