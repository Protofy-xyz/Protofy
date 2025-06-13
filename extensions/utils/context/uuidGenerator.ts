const UUID = require('uuid')

export function generateUuid(version) {
  switch (version) {
    case 'v1':
      return UUID.v1()
    case 'v4':
      return UUID.v4()
    case 'NIL':
      return UUID.NIL
    default:
      return undefined
  }
}
